resource "azurerm_user_assigned_identity" "cluster" {
  name                = "id-${var.aks_name}"
  resource_group_name = var.resource_group_name
  location            = var.location
  tags                = var.tags
}

resource "azurerm_kubernetes_cluster" "this" {
  name                = var.aks_name
  resource_group_name = var.resource_group_name
  location            = var.location
  dns_prefix          = var.aks_name
  kubernetes_version  = var.kubernetes_version
  sku_tier            = "Standard"

  private_cluster_enabled   = var.private_cluster
  private_dns_zone_id       = var.private_cluster ? "System" : null
  automatic_upgrade_channel = "patch"
  node_os_upgrade_channel   = "NodeImage"
  local_account_disabled    = true
  oidc_issuer_enabled       = true
  workload_identity_enabled = true
  azure_policy_enabled      = true
  tags                      = var.tags

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.cluster.id]
  }

  azure_active_directory_role_based_access_control {
    azure_rbac_enabled     = true
    admin_group_object_ids = var.admin_group_object_ids
  }

  dynamic "api_server_access_profile" {
    for_each = var.private_cluster ? [] : [1]
    content {
      authorized_ip_ranges = var.authorized_ip_ranges
    }
  }

  default_node_pool {
    name                         = "system"
    vm_size                      = var.system_vm_size
    vnet_subnet_id               = var.subnet_id
    zones                        = var.zones
    auto_scaling_enabled         = true
    min_count                    = 3
    max_count                    = 5
    os_disk_type                 = "Ephemeral"
    os_disk_size_gb              = 100
    only_critical_addons_enabled = true
    temporary_name_for_rotation  = "systemtmp"
    max_pods                     = 110

    upgrade_settings {
      max_surge = "33%"
    }
  }

  network_profile {
    network_plugin      = "azure"
    network_plugin_mode = "overlay"
    network_data_plane  = "cilium"
    network_policy      = "cilium"
    load_balancer_sku   = "standard"
    outbound_type       = "loadBalancer"
    service_cidr        = "172.16.0.0/16"
    dns_service_ip      = "172.16.0.10"
    pod_cidr            = "192.168.0.0/16"
  }

  oms_agent {
    log_analytics_workspace_id      = var.log_analytics_id
    msi_auth_for_monitoring_enabled = true
  }

  key_vault_secrets_provider {
    secret_rotation_enabled = true
  }

  maintenance_window_auto_upgrade {
    frequency   = "Weekly"
    interval    = 1
    duration    = 4
    day_of_week = "Sunday"
    start_time  = "02:00"
    utc_offset  = "+05:30"
  }

  lifecycle {
    ignore_changes = [kubernetes_version]
  }
}

resource "azurerm_kubernetes_cluster_node_pool" "user" {
  name                  = "user"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.this.id
  vm_size               = var.user_vm_size
  vnet_subnet_id        = var.subnet_id
  zones                 = var.zones
  auto_scaling_enabled  = true
  min_count             = var.user_min_count
  max_count             = var.user_max_count
  os_disk_type          = "Ephemeral"
  os_disk_size_gb       = 100
  mode                  = "User"
  max_pods              = 110
  node_labels           = { workload = "apps" }
  tags                  = var.tags

  upgrade_settings {
    max_surge = "33%"
  }
}

# Kubelet identity pulls images from ACR
resource "azurerm_role_assignment" "acr_pull" {
  scope                            = azurerm_container_registry.this.id
  role_definition_name             = "AcrPull"
  principal_id                     = azurerm_kubernetes_cluster.this.kubelet_identity[0].object_id
  skip_service_principal_aad_check = true
}

resource "azurerm_monitor_diagnostic_setting" "aks" {
  name                       = "diag"
  target_resource_id         = azurerm_kubernetes_cluster.this.id
  log_analytics_workspace_id = var.log_analytics_id

  enabled_log { category = "kube-audit-admin" }
  enabled_log { category = "kube-apiserver" }
  enabled_log { category = "guard" }
  enabled_log { category = "cluster-autoscaler" }
  enabled_metric { category = "AllMetrics" }
}

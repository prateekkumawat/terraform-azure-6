data "azurerm_client_config" "current" {}

locals {
  suffix = "${var.workload}-${var.environment}"
  tags = merge({
    environment = var.environment
    workload    = var.workload
    managed_by  = "terraform"
  }, var.tags)
}

resource "random_string" "uniq" {
  length  = 4
  upper   = false
  special = false
}

resource "azurerm_resource_group" "this" {
  name     = "rg-${local.suffix}"
  location = var.location
  tags     = local.tags
}

resource "azurerm_management_lock" "rg" {
  count      = var.enable_resource_locks ? 1 : 0
  name       = "protect-rg"
  scope      = azurerm_resource_group.this.id
  lock_level = "CanNotDelete"
}

module "monitoring" {
  source              = "./40-monitoring"
  name                = local.suffix
  resource_group_name = azurerm_resource_group.this.name
  location            = var.location
  retention_days      = var.log_retention_days
  tags                = local.tags
}

module "network" {
  source              = "./20-network"
  name                = local.suffix
  resource_group_name = azurerm_resource_group.this.name
  location            = var.location
  address_space       = var.vnet_address_space
  subnet_cidrs        = var.subnet_cidrs
  log_analytics_id    = module.monitoring.workspace_id
  tags                = local.tags
}

module "infra" {
  source              = "./30-infra"
  resource_group_name = azurerm_resource_group.this.name
  location            = var.location
  tags                = local.tags

  acr_name                   = "acr${var.workload}${var.environment}${random_string.uniq.result}"
  aks_name                   = "aks-${local.suffix}"
  key_vault_name             = "kv-${var.workload}-${var.environment}-${random_string.uniq.result}"
  postgres_name              = "psql-${local.suffix}-${random_string.uniq.result}"
  private_endpoint_subnet_id = module.network.pe_subnet_id
  private_dns_zone_ids       = module.network.private_dns_zone_ids
  log_analytics_id           = module.monitoring.workspace_id
  tenant_id                  = data.azurerm_client_config.current.tenant_id

  kubernetes_version     = var.aks_kubernetes_version
  subnet_id              = module.network.aks_subnet_id
  zones                  = var.availability_zones
  admin_group_object_ids = var.aks_admin_group_object_ids
  private_cluster        = var.aks_private_cluster
  authorized_ip_ranges   = var.aks_authorized_ip_ranges
  system_vm_size         = var.aks_system_vm_size
  user_vm_size           = var.aks_user_vm_size
  user_min_count         = var.aks_user_min_count
  user_max_count         = var.aks_user_max_count

  delegated_subnet_id                   = module.network.db_subnet_id
  postgres_sku                          = var.postgres_sku
  postgres_storage_mb                   = var.postgres_storage_mb
  postgres_version                      = var.postgres_version
  postgres_ha_enabled                   = var.postgres_ha_enabled
  postgres_geo_redundant_backup_enabled = var.postgres_geo_redundant_backup_enabled
  postgres_admin_group_name             = var.postgres_admin_group_name
  postgres_admin_group_object_id        = var.postgres_admin_group_object_id
}

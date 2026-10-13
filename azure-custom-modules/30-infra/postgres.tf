resource "azurerm_postgresql_flexible_server" "this" {
  name                          = var.name
  resource_group_name           = var.resource_group_name
  location                      = var.location
  version                       = var.pg_version
  sku_name                      = var.sku_name
  storage_mb                    = var.storage_mb
  auto_grow_enabled             = true
  zone                          = "1"
  delegated_subnet_id           = var.delegated_subnet_id
  private_dns_zone_id           = var.private_dns_zone_id
  public_network_access_enabled = false
  backup_retention_days         = 35
  geo_redundant_backup_enabled  = var.ha_enabled
  tags                          = var.tags

  # No password: Entra ID authentication only (no secrets to store or rotate)
  authentication {
    password_auth_enabled         = false
    active_directory_auth_enabled = true
    tenant_id                     = var.tenant_id
  }

  dynamic "high_availability" {
    for_each = var.ha_enabled ? [1] : []
    content {
      mode                      = "ZoneRedundant"
      standby_availability_zone = "2"
    }
  }

  maintenance_window {
    day_of_week  = 0
    start_hour   = 21 # Sat 21:00 UTC = Sun 02:30 IST
    start_minute = 0
  }

  lifecycle {
    prevent_destroy = true
    ignore_changes  = [zone, high_availability[0].standby_availability_zone]
  }
}

resource "azurerm_postgresql_flexible_server_active_directory_administrator" "this" {
  server_name         = azurerm_postgresql_flexible_server.this.name
  resource_group_name = var.resource_group_name
  tenant_id           = var.tenant_id
  object_id           = var.admin_group_object_id
  principal_name      = var.admin_group_name
  principal_type      = "Group"
}

resource "azurerm_postgresql_flexible_server_configuration" "ssl" {
  server_id = azurerm_postgresql_flexible_server.this.id
  name      = "require_secure_transport"
  value     = "on"
}

resource "azurerm_postgresql_flexible_server_configuration" "log_connections" {
  server_id = azurerm_postgresql_flexible_server.this.id
  name      = "log_connections"
  value     = "on"
}

resource "azurerm_monitor_diagnostic_setting" "this" {
  name                       = "diag"
  target_resource_id         = azurerm_postgresql_flexible_server.this.id
  log_analytics_workspace_id = var.log_analytics_id
  enabled_log { category_group = "allLogs" }
  enabled_metric { category = "AllMetrics" }
}



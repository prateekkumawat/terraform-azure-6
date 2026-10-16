
resource "azurerm_container_registry" "this" {
  name                          = var.acr_name
  resource_group_name           = var.resource_group_name
  location                      = var.location
  sku                           = "Premium"
  admin_enabled                 = false
  public_network_access_enabled = false
  zone_redundancy_enabled       = true
  anonymous_pull_enabled        = false
  tags                          = var.tags
}

resource "azurerm_private_endpoint" "acr" {
  name                = "pe-${var.acr_name}"
  resource_group_name = var.resource_group_name
  location            = var.location
  subnet_id           = var.private_endpoint_subnet_id
  tags                = var.tags

  private_service_connection {
    name                           = "acr"
    private_connection_resource_id = azurerm_container_registry.this.id
    subresource_names              = ["registry"]
    is_manual_connection           = false
  }
  private_dns_zone_group {
    name                 = "default"
    private_dns_zone_ids = [var.private_dns_zone_ids["acr"]]
  }
}

resource "azurerm_monitor_diagnostic_setting" "acr" {
  name                       = "diag"
  target_resource_id         = azurerm_container_registry.this.id
  log_analytics_workspace_id = var.log_analytics_id
  enabled_log { category_group = "allLogs" }
  enabled_metric { category = "AllMetrics" }
}

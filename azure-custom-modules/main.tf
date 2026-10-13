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
  source                     = "./30-infra/"
  name                       = "kv-${var.workload}-${var.environment}-${random_string.uniq.result}"
  resource_group_name        = azurerm_resource_group.this.name
  location                   = var.location
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  private_endpoint_subnet_id = module.network.pe_subnet_id
  private_dns_zone_id        = module.network.private_dns_zone_ids["keyvault"]
  log_analytics_id           = module.monitoring.workspace_id
  tags                       = local.tags

  name                       = "acr${var.workload}${var.environment}${random_string.uniq.result}"
  resource_group_name        = azurerm_resource_group.this.name
  location                   = var.location
  private_endpoint_subnet_id = module.network.pe_subnet_id
  private_dns_zone_id        = module.network.private_dns_zone_ids["acr"]
  log_analytics_id           = module.monitoring.workspace_id
  tags                       = local.tags
}

# module "aks" {
#   source                 = "./modules/aks"
  name                   = "aks-${local.suffix}"
  resource_group_name    = azurerm_resource_group.this.name
  location               = var.location
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
  log_analytics_id       = module.monitoring.workspace_id
  acr_id                 = module.acr.id
  tags                   = local.tags


# module "postgres" {
#   source                = "./modules/postgres"
  name                  = "psql-${local.suffix}-${random_string.uniq.result}"
  resource_group_name   = azurerm_resource_group.this.name
  location              = var.location
  delegated_subnet_id   = module.network.db_subnet_id
  private_dns_zone_id   = module.network.private_dns_zone_ids["postgres"]
  sku_name              = var.postgres_sku
  storage_mb            = var.postgres_storage_mb
  pg_version            = var.postgres_version
  ha_enabled            = var.postgres_ha_enabled
  tenant_id             = data.azurerm_client_config.current.tenant_id
  admin_group_name      = var.postgres_admin_group_name
  admin_group_object_id = var.postgres_admin_group_object_id
  log_analytics_id      = module.monitoring.workspace_id
  tags                  = local.tags
}

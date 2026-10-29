resource "azurerm_resource_group" "tfstate" {
  name     = "rg-tfstate-prod"
  location = var.location
}

resource "azurerm_storage_account" "tfstate" {
  name                            = "sttfstate${var.name_suffix}"
  resource_group_name             = azurerm_resource_group.tfstate.name
  location                        = azurerm_resource_group.tfstate.location
  account_tier                    = "Standard"
  account_replication_type        = "GRS"
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = false
  shared_access_key_enabled       = false # use Entra ID auth (use_azuread_auth = true)

  blob_properties {
    versioning_enabled = true
    delete_retention_policy { days = 30 }
    container_delete_retention_policy { days = 30 }
  }
}

resource "azurerm_storage_container" "tfstate" {
  name                  = "tfstate"
  storage_account_id    = azurerm_storage_account.tfstate.id
  container_access_type = "private"
  timeouts {
    create = "10m" # fail fast instead of retrying for an hour
  }
}

# resource "azurerm_management_lock" "tfstate" {
#   name       = "protect-tfstate"
#   scope      = azurerm_resource_group.tfstate.id
#   lock_level = "CanNotDelete"
#   notes      = "Terraform state - do not delete"

#   depends_on = [azurerm_storage_container.tfstate]
# }


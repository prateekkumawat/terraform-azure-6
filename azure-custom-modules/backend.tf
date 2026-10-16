# Initialise with:
#   terraform init -backend-config="storage_account_name=<name>" -backend-config="key=prod.tfstate"
terraform {
  backend "azurerm" {
    resource_group_name = "rg-tfstate-prod"
    container_name      = "tfstate"
    use_azuread_auth    = true
  }
}

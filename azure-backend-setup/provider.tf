terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "5.3.0"
    }
  }
  backend "azurerm" {
    use_cli              = true                                   
    use_azuread_auth     = false      
    resource_group_name  = "vm1_group"                           
    storage_account_name = "hsitappsterraform"                             
    container_name       = "tfstate"                                             
  }
}


provider "azurerm" {
  features {}
  # subscription_id = "your-subscription-id"
  # tenant_id       = "your-tenant-id"
  # client_id       = "your-client-id"
  # client_secret   = "your-client-secret"
}

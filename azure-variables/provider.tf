terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "5.3.0"
    }
  }
}

provider "azurerm" {
  features {}
  # subscription_id = "your-subscription-id"
  # tenant_id       = "your-tenant-id"
  # client_id       = "your-client-id"
  # client_secret   = "your-client-secret"
}

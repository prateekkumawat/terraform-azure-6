# Run ONCE with local state to create the remote state backend blob then add and migrate states.
terraform {
  required_version = ">= 1.9.0"
  required_providers {
    azurerm = { source = "hashicorp/azurerm", version = "~> 4.0" }
  }
}

provider "azurerm" {
  subscription_id = var.subscription_id
  features {}
}

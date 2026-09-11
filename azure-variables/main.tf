resource "azurerm_resource_group" "this" {
  name     = "${var.project}-${var.environment}-use1"
  location = var.location
  tags = {
    environment = var.environment
    project     = var.project
  }
}
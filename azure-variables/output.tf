output "resourcegroup-name" {
  value = azurerm_resource_group.this.id
}

output "resourcegroup-location" {
  value = azurerm_resource_group.this.location
}
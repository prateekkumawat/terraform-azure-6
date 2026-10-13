output azurerm_resource_group_name {
  value = data.azurerm_resource_group.this1.name
}

output azurerm_virtual_network_name {
  value = data.azurerm_virtual_network.this1.name
}

output azurerm_resource_group_Location {
  value = data.azurerm_resource_group.this1.location
}

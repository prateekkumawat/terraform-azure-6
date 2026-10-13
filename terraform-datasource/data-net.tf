data "azurerm_resource_group" "this1" {
  name = "terraform-test"
}

data "azurerm_virtual_network" "this1" {
  name                = "vnet1"
  resource_group_name = data.azurerm_resource_group.this1.name
}

data "azurerm_subnet" "this1" {
  name                 = "default"
  virtual_network_name = data.azurerm_virtual_network.this1.name
  resource_group_name  = data.azurerm_resource_group.this1.name
}
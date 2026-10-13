resource "azurerm_subnet" "subnet1" {
  name                = "subnet1"
  resource_group_name = data.azurerm_resource_group.this1.name
  virtual_network_name = data.azurerm_virtual_network.this1.name
  address_prefixes    = ["10.0.1.0/24"]
}

resource "azurerm_subnet" "subnet2" {
  name                = "subnet2"
  resource_group_name = data.azurerm_resource_group.this1.name
  virtual_network_name = data.azurerm_virtual_network.this1.name
  address_prefixes    = ["10.0.2.0/24"]
}

resource "azurerm_subnet" "subnet3" {
  name                = "subnet3"
  resource_group_name = data.azurerm_resource_group.this1.name
  virtual_network_name = data.azurerm_virtual_network.this1.name
  address_prefixes    = ["10.0.3.0/24"]
}

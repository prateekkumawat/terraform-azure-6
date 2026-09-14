resource "azurerm_resource_group" "this" {
  for_each = local.resource_group
  name     = each.value.name
  location = each.value.location
}

resource "azurerm_virtual_network" "this" {
  for_each = local.vnets
  name                = each.value.name
  address_space       = each.value.address_space
  location            = each.value.location
  resource_group_name = azurerm_resource_group.this[each.value.resoruce_group_name].name
}
output "resource_group_out"{
  value = {
  for k, v in azurerm_resource_group.this : k => {
    name     = v.name
    location = v.location
  }
  } 
}

output "vnet_out"{
  value = {
  for k, v in azurerm_virtual_network.this : k => {
    name                = v.name
    address_space       = v.address_space
    location            = v.location
    resource_group_name = v.resource_group_name
  }
  } 
}
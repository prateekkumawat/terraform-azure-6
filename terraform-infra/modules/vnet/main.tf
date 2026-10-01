locals {
  vnet_detail = { 
    for k, v in var.vnet_details : k => {
        name        = v.name
        location    = v.location
        vnet-cidr   = v.vnet-cidr
        vnet-name   = v.vnet-name
    }
  }
}

locals {
  subnet_detail = { 
    for k, v in var.subnet_details : k => {
        address_prefixes   = v.address_prefixes
        name               = v.name
        resource_group_name = v.resource_group_name
        virtual_network_name = v.virtual_network_name
        private_endpoint_network_policies             = lookup(v, "private_endpoint_network_policies", null)
        private_link_service_network_policies_enabled = v.private_link_service_network_policies_enabled
        
    }
  }
}

resource "azurerm_virtual_network" "this" {
  for_each = local.vnet_detail
   
   name             = each.value.vnet-name
   location         = each.value.location
   resource_group_name = each.value.name
   address_space    = [each.value.vnet-cidr]

}

resource "azurerm_subnet" "this" {
  for_each = local.subnet_detail
   
    name                 = each.value.name
    resource_group_name  = each.value.resource_group_name
    virtual_network_name = each.value.virtual_network_name
    address_prefixes     = each.value.address_prefixes
    private_endpoint_network_policies             = each.value.private_endpoint_network_policies
    private_link_service_network_policies_enabled = each.value.private_link_service_network_policies_enabled
}
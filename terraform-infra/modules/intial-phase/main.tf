locals {
  resource_group_detail = { 
    for k, v in var.resource_group_details : k => {
        name        = v.name
        location    = v.location
    }
  }
}

resource "azurerm_resource_group" "this" {
  for_each = local.resource_group_detail 
   
   name             = each.value.name 
   location         = each.value.location
}
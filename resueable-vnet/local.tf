locals {
  resource_group = {
   for k,v in var.resource_groups : k => {
    name     = v.name
    location = v.location
   }
  }
}

locals { 
    vnets = {
        for k,v in var.vnet : k => {
            name          = v.name
            address_space = v.address_space
            location      = v.location 
            resoruce_group_name = v.resource_group_name
        }
    }
}
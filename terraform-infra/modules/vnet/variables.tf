variable "vnet_details"{
    type = map(object({
        name  =  string
        location = string
        vnet-cidr = string
        vnet-name = string
    }))
}


variable "subnet_details"{
    type = map(object({
         address_prefixes   = list(string)
         name               = string
         resource_group_name = string
         virtual_network_name = string
         private_endpoint_network_policies             = optional(string, null)
         private_link_service_network_policies_enabled = bool
    }))
}

variable "resource_groups" {
   type = map(object({
     name     = string
     location = string
   }))
}


variable "vnet" {
  type = map(object({
    name                = string
    address_space       = list(string)
    location            = optional(string)
    resource_group_name = optional(string)
  }))
}
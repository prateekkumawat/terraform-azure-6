variable "resource_locations" {}
variable "resource_name" {}
variable "storage_accounts_count" {}
variable "storage_accounts_name" {}
variable "applicaiton_rules" {
  type = map(object({
    name                       = string
    priority                   = number
    direction                  = string
    access                     = string
    protocol                   = string
    source_port_range          = optional(string)
    destination_port_range     = optional(string)
    source_address_prefix      = optional(string)
    destination_address_prefix = optional(string)
}))
}
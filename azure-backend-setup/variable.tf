variable "resource_locations" {}
variable "resource_name" {}
variable "storage_account_count_enable" {
  type = bool
}
variable "storage_accounts_count" {}
variable "storage_accounts_name" {}
variable "application_rules_enable" {
   type = bool
}

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

variable "storage_accounts_multiname_enable" {
   type = bool
}
variable "storage_accounts_multiname" {
   type = list 
}

variable "storage_accounts_reuseable_enable"{
   type = bool 
} 
variable "storage_accounts_reuseable" {
   type = map(object({
    name                     = string
    resource_group_name      = string
    location                 = string
    account_tier             = optional(string)
    account_replication_type = string
    access_tier              = optional(string)
    allow_nested_items_to_be_public = optional(bool)
   }))
}
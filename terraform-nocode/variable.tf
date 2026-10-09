variable "resource_group_name" {
  description = "The name of the resource group in which to create the virtual network."
  type        = string
}

variable "location" {
  description = "The Azure region in which to create the virtual network."
  type        = string
}

variable "vnet_name" {
  description = "The name of the virtual network to create."
  type        = string
}

variable "address_space" {
  description = "The address space of the virtual network."
  type        = list(string)
}

variable "subnet_names" {
  description = "A list of names for the subnets to create within the virtual network."
  type        = list(string)
}

variable "subnet_prefixes" {
  description = "A list of address prefixes for the subnets to create within the virtual network."
  type        = list(string)
}

variable "nsg_name" {
  description = "The name of the network security group to create."
  type        = string
}


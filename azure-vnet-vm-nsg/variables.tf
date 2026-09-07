variable "resource_group_name" {
  description = "please enter resource group name"
}
variable "location" {
  description = "please enter location"
}
variable "environment" {}
variable "project" {}
variable "vnet_name" {}
variable "vnet_address_space" {}
variable "subnet_address_space" {
    type = list
}
variable "vm_name" {}
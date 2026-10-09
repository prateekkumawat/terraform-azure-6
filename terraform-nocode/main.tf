module "vnet" {
  source  = "Azure/vnet/azurerm"
  version = "5.0.1"

    resource_group_name = var.resource_group_name
    vnet_location       = var.location  
    vnet_name           = var.vnet_name
    address_space       = var.address_space
    subnet_names        = var.subnet_names
    subnet_prefixes     = var.subnet_prefixes

}

data "azurerm_resource_group" "this" {
  name     = module.vnet.resource_group_name.id
}

module "avm-res-network-sg-with-rule" {
  source  = "Azure/avm-res-network-networksecuritygroup/azurerm"
  version = "0.6.0"

  location         = module.vnet.vnet_location
  name             = var.nsg_name
  parent_id        = data.azurerm_resource_group.this.id
  security_rules   = local.nsg_rules
}
locals {
  nsg_rules = {
    "rule01" = {
      name                       = "vnet-nsg-rule01"
      access                     = "Deny"
      destination_address_prefix = "*"
      destination_port_range     = "80-88"
      direction                  = "Outbound"
      priority                   = 100
      protocol                   = "Tcp"
      source_address_prefix      = "*"
      source_port_range          = "*"
    }
    "rule02" = {
      name                       = "vnet-nsg-rule02"
      access                     = "Allow"
      destination_address_prefix = "*"
      destination_port_ranges    = ["80", "443"]
      direction                  = "Inbound"
      priority                   = 200
      protocol                   = "Tcp"
      source_address_prefix      = "*"
      source_port_range          = "*"
    }
  }
}
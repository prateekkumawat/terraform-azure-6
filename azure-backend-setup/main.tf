resource "azurerm_resource_group" "example" {
  name     = var.resource_name
  location = var.resource_locations
}

resource "azurerm_storage_account" "example" {
  count                    = var.storage_account_count_enable ? var.storage_accounts_count : 0
  name                     = "${var.storage_accounts_name}${count.index + 1}"
  resource_group_name      = azurerm_resource_group.example.name
  location                 = azurerm_resource_group.example.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    environment = "learning"
  }
}

resource "azurerm_network_security_group" "example" {
  count               = var.application_rules_enable ? 1 : 0
  name                = "acceptanceTestSecurityGroup1"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name

  dynamic "security_rule" {
      for_each = var.applicaiton_rules 
      content {
            name                       = security_rule.value.name
            priority                   = security_rule.value.priority
            direction                  = security_rule.value.direction
            access                     = security_rule.value.access
            protocol                   = security_rule.value.protocol
            source_port_range          = security_rule.value.source_port_range
            destination_port_range     = security_rule.value.destination_port_range
            source_address_prefix      = security_rule.value.source_address_prefix
            destination_address_prefix = security_rule.value.destination_address_prefix
        }    
    } 
  tags = {
    environment = "Production"
  }
}

resource "azurerm_storage_account" "this1" {
  for_each                 =  { for k ,v in toset(var.storage_accounts_multiname) : k => v if var.storage_accounts_multiname_enable } 
  name                     =  each.value
  resource_group_name      = azurerm_resource_group.example.name
  location                 = azurerm_resource_group.example.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    environment = "learning"
  }
}

resource "azurerm_storage_account" "this2" {
  
  for_each                 =  { for k, v in var.storage_accounts_reuseable : k => v if var.storage_accounts_reuseable_enable }
  name                     =  each.value.name
  resource_group_name      =  each.value.resource_group_name
  location                 =  each.value.location
  account_tier             =  each.value.account_tier
  account_replication_type =  each.value.account_replication_type
  access_tier              =  each.value.access_tier
  allow_nested_items_to_be_public = each.value.allow_nested_items_to_be_public

  tags = {
    environment = "learning"
  }
}
resource_locations = "Central India"
resource_name = "hsit-apps"
storage_account_count_enable = true
storage_accounts_count = 2
storage_accounts_name = "hsitappstorages"
application_rules_enable = false
applicaiton_rules = {
  "HTTP" = {
    name                       = "HTTP"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  "HTTPS" = {
    name                       = "HTTPS"
    priority                   = 101
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  "RDP" = {
    name                       = "RDP"
    priority                   = 102
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

storage_accounts_multiname_enable = true
storage_accounts_multiname = ["storageappsstage", "storageprodprojectx", "storageappsaccounts"]

storage_accounts_reuseable_enable = true
storage_accounts_reuseable = {
  "appsaccount1" = {
    name                     = "appsaccount1"
    resource_group_name      = "apps"
    location                 = "Central India"
    account_tier             = "Standard"
    account_replication_type = "LRS"
  }
  "appsaccount2" = {
    name                     = "appsaccount2"
    resource_group_name      = "apps"
    location                 = "Central India"
    account_tier             = "Standard"
    account_replication_type = "LRS"
  }
}
resource "azurerm_resource_group" "rs1" {
  name     =  var.resource_group_name
  location =  var.location
  tags = {
    environment = var.environment
    project     = var.project
  }
}

resource "azurerm_virtual_network" "this" {
  name                = "${var.project}-${var.environment}-${var.vnet_name}"
  location            = azurerm_resource_group.rs1.location
  resource_group_name = azurerm_resource_group.rs1.name
  address_space       = [var.vnet_address_space]
  tags = {
    environment = var.environment
    project     = var.project
  }
}

resource "azurerm_subnet" "this1" {
  name                 = "${var.project}-${var.environment}-subnet1"
  resource_group_name  = azurerm_resource_group.rs1.name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = [var.subnet_address_space[0]]
}    

resource "azurerm_subnet" "this2" {
  name                 = "${var.project}-${var.environment}-subnet2"
  resource_group_name  = azurerm_resource_group.rs1.name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = [var.subnet_address_space[1]]
}

resource "azurerm_subnet" "this3" {
  name                 = "${var.project}-${var.environment}-subnet3"
  resource_group_name  = azurerm_resource_group.rs1.name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = [var.subnet_address_space[2]]
}

resource "azurerm_network_interface" "this" {
  name                = "${var.project}-${var.environment}-${var.vm_name}-nic"
  location            = azurerm_resource_group.rs1.location
  resource_group_name = azurerm_resource_group.rs1.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.this1.id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                = var.vm_name
  resource_group_name = azurerm_resource_group.rs1.name
  location            = azurerm_resource_group.rs1.location
  size                = "Standard_B2s"

  admin_username = "testadmin"
  admin_password = "Password1234!"

  disable_password_authentication = false

  network_interface_ids = [
    azurerm_network_interface.this.id
  ]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "ubuntu-24_04-lts"
    sku       = "server"
    version   = "latest"
  }
}
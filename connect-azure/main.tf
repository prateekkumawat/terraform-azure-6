resource "azurerm_resource_group" "rs1" {
  name     = "rg2-terraform-vm"
  location = "Central India"
}


resource "azurerm_resource_group" "rs2" {
  name     = "rg-terraform-vm"
  location = "South India"
}

resource "azurerm_virtual_network" "rs1net" {
  name                = "vnet-terraform-1"
  location            = azurerm_resource_group.rs1.location
  resource_group_name = azurerm_resource_group.rs1.name
  address_space       = ["10.10.0.0/16"]
}


resource "azurerm_virtual_network" "rs2net" {
  name                = "vnet-terraform-2"
  location            = azurerm_resource_group.rs2.location
  resource_group_name = azurerm_resource_group.rs2.name
  address_space       = ["10.20.0.0/16"]
}

resource "azurerm_subnet" "rssubnet1" {
  name                 = "subnet1-vm"
  resource_group_name  = azurerm_resource_group.rs1.name
  virtual_network_name = azurerm_virtual_network.rs1net.name
  address_prefixes     = ["10.10.1.0/24"]
}


resource "azurerm_subnet" "rs2subnet1" {
  name                 = "subnet1-vm"
  resource_group_name  = azurerm_resource_group.rs2.name
  virtual_network_name = azurerm_virtual_network.rs2net.name
  address_prefixes     = ["10.20.1.0/24"]
}


# resource "azurerm_network_interface" "vm" {
#   name                = "nic-terraform-vm"
#   location            = azurerm_resource_group.vm.location
#   resource_group_name = azurerm_resource_group.vm.name

#   ip_configuration {
#     name                          = "internal"
#     subnet_id                     = azurerm_subnet.vm.id
#     private_ip_address_allocation = "Dynamic"
#   }
# }
# resource "azurerm_linux_virtual_machine" "vm" {
#   name                = "terraform-vm"
#   resource_group_name = azurerm_resource_group.vm.name
#   location            = azurerm_resource_group.vm.location
#   size                = "Standard_B2s"

#   admin_username = "testadmin"
#   admin_password = "Password1234!"

#   disable_password_authentication = false

#   network_interface_ids = [
#     azurerm_network_interface.vm.id
#   ]

#   os_disk {
#     caching              = "ReadWrite"
#     storage_account_type = "Standard_LRS"
#   }

#   source_image_reference {
#     publisher = "Canonical"
#     offer     = "ubuntu-24_04-lts"
#     sku       = "server"
#     version   = "latest"
#   }
# }
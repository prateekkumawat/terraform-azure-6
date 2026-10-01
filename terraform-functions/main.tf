resource "tls_private_key" "this" {
  algorithm = "RSA"
}

resource "local_file" "keys" {
  filename = "vm.pem"
  content = tls_private_key.this.private_key_pem
}
resource "azurerm_resource_group" "example" {
  name     = "check-resources"
  location = "Central India"
}

resource "azurerm_virtual_network" "main" {
  name                = "vm-network"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
}

resource "azurerm_subnet" "internal" {
  name                 = "internal"
  resource_group_name  = azurerm_resource_group.example.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/24"]
}

resource "azurerm_network_interface" "main" {
  name                = "vm-netwrok-nic"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name

  ip_configuration {
    name                          = "testconfiguration1"
    subnet_id                     = azurerm_subnet.internal.id
    private_ip_address_allocation = "Dynamic"
  }
}


resource "azurerm_virtual_machine" "main" {
  name                  = "vms-vm"
  location              = azurerm_resource_group.example.location
  resource_group_name   = azurerm_resource_group.example.name
  network_interface_ids = [azurerm_network_interface.main.id]
  vm_size               = "Standard_DS1_v2"

  storage_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }
  storage_os_disk {
    name              = "myosdisk1"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
  }
 
  os_profile {
    computer_name  = "vms-vm"
    admin_username = "azadmin"
  } 

  os_profile_linux_config {
    disable_password_authentication = true
  
  ssh_keys {
      key_data = tls_private_key.this.public_key_openssh
      path = "/home/azadmin/.ssh/authorized_keys"
    }
  }   
}

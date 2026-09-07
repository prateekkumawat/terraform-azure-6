output "vnet_address_space" {
  value = azurerm_virtual_network.this.address_space
}

output "vm_private_ip" {
  value = azurerm_network_interface.this.private_ip_address
}

output "vm_public_ip" {
    value = azurerm_linux_virtual_machine.vm.public_ip_address
}
output "vms_vm_public_ip" {
  value = azurerm_virtual_network.main.address_space
}
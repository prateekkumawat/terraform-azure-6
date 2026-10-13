output "vnet_id" { 
    value = azurerm_virtual_network.this.id 
}

output "aks_subnet_id" { 
    value = azurerm_subnet.aks.id 
}

output "db_subnet_id" { 
    value = azurerm_subnet.db.id 
}

output "pe_subnet_id" { 
    value = azurerm_subnet.pe.id 
}

output "private_dns_zone_ids" {
  value = { 
    for k, z in azurerm_private_dns_zone.this : k => z.id 
    }
}

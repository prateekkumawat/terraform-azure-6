output "container_id" {
     value = azurerm_container_registry.this.id 
}

output "login_server" { 
    value = azurerm_container_registry.this.login_server 
}

output "name" { 
    value = azurerm_kubernetes_cluster.this.name 
}

output "id" { 
    value = azurerm_kubernetes_cluster.this.id 
}

output "oidc_issuer_url" { 
    value = azurerm_kubernetes_cluster.this.oidc_issuer_url 
}

output "kubelet_object_id" { 
    value = azurerm_kubernetes_cluster.this.kubelet_identity[0].object_id 
}

output "key_vault_id" { 
    value = azurerm_key_vault.this.id 
}

output "vault_uri" { 
    value = azurerm_key_vault.this.vault_uri 
}

output "postgre_server_id" { 
    value = azurerm_postgresql_flexible_server.this.id 
}
output "fqdn" { 
    value = azurerm_postgresql_flexible_server.this.fqdn 
}
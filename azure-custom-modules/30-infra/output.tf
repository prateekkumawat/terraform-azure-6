output "acr_id" {
  value = azurerm_container_registry.this.id
}

output "acr_login_server" {
  value = azurerm_container_registry.this.login_server
}

output "aks_name" {
  value = azurerm_kubernetes_cluster.this.name
}

output "aks_id" {
  value = azurerm_kubernetes_cluster.this.id
}

output "aks_oidc_issuer_url" {
  value = azurerm_kubernetes_cluster.this.oidc_issuer_url
}

output "aks_kubelet_object_id" {
  value = azurerm_kubernetes_cluster.this.kubelet_identity[0].object_id
}

output "key_vault_id" {
  value = azurerm_key_vault.this.id
}

output "key_vault_uri" {
  value = azurerm_key_vault.this.vault_uri
}

output "postgres_server_id" {
  value = azurerm_postgresql_flexible_server.this.id
}

output "postgres_fqdn" {
  value = azurerm_postgresql_flexible_server.this.fqdn
}

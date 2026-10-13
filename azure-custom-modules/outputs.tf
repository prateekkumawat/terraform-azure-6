output "resource_group_name" { value = azurerm_resource_group.this.name }
output "aks_name" { value = module.aks.name }
output "aks_oidc_issuer_url" { value = module.aks.oidc_issuer_url }
output "acr_login_server" { value = module.acr.login_server }
output "key_vault_uri" { value = module.keyvault.vault_uri }
output "postgres_fqdn" { value = module.postgres.fqdn }
output "log_analytics_workspace_id" { value = module.monitoring.workspace_id }

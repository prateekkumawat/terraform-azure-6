output "resource_group_name" { value = azurerm_resource_group.this.name }
output "aks_name" { value = module.infra.aks_name }
output "aks_oidc_issuer_url" { value = module.infra.aks_oidc_issuer_url }
output "acr_login_server" { value = module.infra.acr_login_server }
output "key_vault_uri" { value = module.infra.key_vault_uri }
output "postgres_fqdn" { value = module.infra.postgres_fqdn }
output "log_analytics_workspace_id" { value = module.monitoring.workspace_id }

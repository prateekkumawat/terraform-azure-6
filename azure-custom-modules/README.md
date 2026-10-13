# Azure Terraform – Production Baseline

Stack: VNet + NSGs + Private DNS, AKS (private, zonal, Entra RBAC, Cilium, workload identity),
ACR Premium (private), Key Vault Premium (private, RBAC, purge-protected),
PostgreSQL Flexible Server (private, zone-redundant HA, Entra-only auth), Log Analytics + diagnostics.

## Usage
```bash
az login && az account set --subscription <SUB_ID>

# 1. One-time: remote state
cd bootstrap
terraform init && terraform apply -var subscription_id=<SUB_ID> -var name_suffix=ab12

# 2. Deploy an environment (edit envs/<env>.tfvars first)
cd ..
terraform init -backend-config="storage_account_name=sttfstateab12" -backend-config="key=prod.tfstate"
terraform plan  -var-file=envs/prod.tfvars -out=prod.tfplan
terraform apply prod.tfplan
```
The identity running Terraform needs Contributor + User Access Administrator (or Owner) on the
subscription, and Storage Blob Data Contributor on the state storage account.

## Notes
- AKS, ACR, Key Vault and Postgres have public access disabled. Run Terraform and kubectl from a
  runner inside or peered to the VNet (self-hosted agent, jump host, VPN). To test from a laptop, set
  `aks_private_cluster = false` and `aks_authorized_ip_ranges`.
- Use a separate state key per environment (`-backend-config="key=dev.tfstate"`).
- Not included (add as needed): Application Gateway/Front Door + WAF, Azure Firewall egress,
  hub-spoke peering/VPN, Defender for Cloud, Azure Policy assignments, budget alerts, CI/CD pipeline.
- Postgres has `prevent_destroy`; remove it deliberately to tear down.
- Run `terraform fmt -recursive` and `terraform validate` before first apply.

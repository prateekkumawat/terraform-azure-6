subscription_id = "00000000-0000-0000-0000-000000000000"
environment     = "dev"
workload        = "app"
location        = "centralindia"

vnet_address_space = ["10.20.0.0/16"]
subnet_cidrs = {
  aks = "10.20.0.0/20"
  db  = "10.20.16.0/24"
  pe  = "10.20.17.0/24"
}

aks_admin_group_object_ids = ["00000000-0000-0000-0000-000000000000"]
aks_system_vm_size         = "Standard_D2s_v5"
aks_user_vm_size           = "Standard_D2s_v5"
aks_user_min_count         = 1
aks_user_max_count         = 3

postgres_sku                   = "B_Standard_B2s"
postgres_storage_mb            = 32768
postgres_ha_enabled            = false
postgres_admin_group_name      = "sg-db-admins"
postgres_admin_group_object_id = "00000000-0000-0000-0000-000000000000"
log_retention_days             = 30
enable_resource_locks          = false

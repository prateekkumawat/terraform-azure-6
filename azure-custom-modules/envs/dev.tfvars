subscription_id = "3978c96b-d2ca-4e91-99fb-423d8b50db6c"
environment     = "dev"
workload        = "app"
location        = "centralindia"

vnet_address_space = ["10.20.0.0/16"]
subnet_cidrs = {
  aks = "10.20.0.0/20"
  db  = "10.20.16.0/24"
  pe  = "10.20.17.0/24"
}

aks_admin_group_object_ids = ["7350424f-908c-4f6a-b6c3-1c75b7f31517"]
aks_system_vm_size         = "Standard_D2_v2"   #"Standard_D2ds_v5"
aks_user_vm_size           = "Standard_D2_v2"   #"Standard_D2ds_v5"
aks_user_min_count         = 1
aks_user_max_count         = 3

postgres_sku                   = "GP_Standard_D2s_v3"
postgres_storage_mb            = 32768
postgres_ha_enabled            = false
postgres_admin_group_name      = "grp-psql-app-dev-admins"
postgres_admin_group_object_id = "c7333960-6b4c-4113-bcec-016edd6ff8c5"
log_retention_days             = 30
enable_resource_locks          = false

subscription_id = "00000000-0000-0000-0000-000000000000"
environment     = "prod"
workload        = "app"
location        = "centralindia"

aks_admin_group_object_ids = ["00000000-0000-0000-0000-000000000000"]
aks_kubernetes_version     = "1.31"
aks_user_min_count         = 3
aks_user_max_count         = 12

postgres_admin_group_name             = "sg-db-admins"
postgres_admin_group_object_id        = "00000000-0000-0000-0000-000000000000"
postgres_ha_enabled                   = true
postgres_geo_redundant_backup_enabled = true
log_retention_days                    = 90

tags = { owner = "platform-team", cost_center = "1234" }

variable "subscription_id" { type = string }

variable "environment" {
  type = string
  validation {
    condition     = contains(["dev", "stg", "prod"], var.environment)
    error_message = "environment must be dev, stg or prod."
  }
}

variable "workload" {
  type    = string
  default = "app"
}

variable "location" {
  type    = string
  default = "centralindia"
}

variable "vnet_address_space" {
  type    = list(string)
  default = ["10.10.0.0/16"]
}

variable "subnet_cidrs" {
  type = object({
    aks = string
    db  = string
    pe  = string
  })
  default = {
    aks = "10.10.0.0/20"
    db  = "10.10.16.0/24"
    pe  = "10.10.17.0/24"
  }
}

variable "availability_zones" {
  type    = list(string)
  default = ["1", "2", "3"]
}

variable "aks_admin_group_object_ids" {
  description = "Entra ID group object IDs granted cluster-admin"
  type        = list(string)
}

variable "aks_kubernetes_version" {
  type    = string
  default = null # null = AKS default; pin in prod.tfvars
}

variable "aks_system_vm_size" {
  type    = string
  default = "Standard_D4s_v5"
}

variable "aks_user_vm_size" {
  type    = string
  default = "Standard_D4s_v5"
}

variable "aks_user_min_count" {
  type    = number
  default = 3
}

variable "aks_user_max_count" {
  type    = number
  default = 10
}

variable "aks_private_cluster" {
  type    = bool
  default = true
}

variable "aks_authorized_ip_ranges" {
  description = "Only used when aks_private_cluster = false"
  type        = list(string)
  default     = []
}

variable "postgres_sku" {
  type    = string
  default = "GP_Standard_D4ds_v5"
}

variable "postgres_storage_mb" {
  type    = number
  default = 131072
}

variable "postgres_version" {
  type    = string
  default = "16"
}

variable "postgres_ha_enabled" {
  type    = bool
  default = true
}

variable "postgres_geo_redundant_backup_enabled" {
  description = "Enable geo-redundant backups independently of zone-redundant high availability."
  type        = bool
  default     = false
}

variable "postgres_admin_group_name" {
  description = "Entra group display name set as Postgres admin"
  type        = string
}

variable "postgres_admin_group_object_id" {
  type = string
}

variable "log_retention_days" {
  type    = number
  default = 90
}

variable "enable_resource_locks" {
  type    = bool
  default = true
}

variable "tags" {
  type    = map(string)
  default = {}
}

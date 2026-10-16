variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "tags" {
  type = map(string)
}

variable "acr_name" {
  type = string
}

variable "aks_name" {
  type = string
}

variable "key_vault_name" {
  type = string
}

variable "postgres_name" {
  type = string
}

variable "private_endpoint_subnet_id" {
  type = string
}

variable "private_dns_zone_ids" {
  type = map(string)
}

variable "log_analytics_id" {
  type = string
}

variable "tenant_id" {
  type = string
}

variable "kubernetes_version" {
  type    = string
  default = null
}

variable "subnet_id" {
  type = string
}

variable "zones" {
  type = list(string)
}

variable "admin_group_object_ids" {
  type = list(string)
}

variable "private_cluster" {
  type = bool
}

variable "authorized_ip_ranges" {
  type = list(string)
}

variable "system_vm_size" {
  type = string
}

variable "user_vm_size" {
  type = string
}

variable "user_min_count" {
  type = number
}

variable "user_max_count" {
  type = number
}

variable "delegated_subnet_id" {
  type = string
}

variable "postgres_sku" {
  type = string
}

variable "postgres_storage_mb" {
  type = number
}

variable "postgres_version" {
  type = string
}

variable "postgres_ha_enabled" {
  type = bool
}

variable "postgres_geo_redundant_backup_enabled" {
  type = bool
}

variable "postgres_admin_group_name" {
  type = string
}

variable "postgres_admin_group_object_id" {
  type = string
}

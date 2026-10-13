variable "name" { 
    type = string 
}

variable "resource_group_name" { 
    type = string 
}

variable "location" { 
    type = string 
}

variable "private_endpoint_subnet_id" { 
    type = string 
}

variable "private_dns_zone_id" { 
    type = string 
}

variable "log_analytics_id" { 
    type = string 
}

variable "tags" { 
    type = map(string) 
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
variable "log_analytics_id" { 
    type = string 
}
variable "acr_id" { 
    type = string 
}
variable "tags" { 
    type = map(string) 
}

variable "tenant_id" { 
    type = string 
}


variable "delegated_subnet_id" { 
    type = string 
}

variable "sku_name" { 
    type = string 
}
variable "storage_mb" {
     type = number 
}
variable "pg_version" { 
    type = string 
}
variable "ha_enabled" { 
    type = bool 
}

variable "admin_group_name" { 
    type = string 
}
variable "admin_group_object_id" { 
    type = string 
}


variable "environment" {
  description = "Please enter your enviorment name"
  type        = string

  validation {
    condition     = contains(["stage", "pp", "prod"], var.environment)
    error_message = "Enviorment name should be stage pp or prod."
  }
}

variable "project" {
  description = "Please enter your project name"
  type        = string
}

variable "location" {
  description = "Please enter your Azure location"
  type        = string

  validation {
    condition     = contains(["Central India", "West India", "South India"], var.location)
    error_message = "Location should be India origin."
  }
}


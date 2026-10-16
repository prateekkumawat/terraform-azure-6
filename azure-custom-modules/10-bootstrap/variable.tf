
variable "subscription_id" {
  type = string
  default = "3978c96b-d2ca-4e91-99fb-423d8b50db6c"
}
variable "location" {
  type    = string
  default = "centralindia"
}
variable "name_suffix" {
  description = "Short unique suffix (3-6 lowercase chars) for globally-unique storage name"
  type        = string
  default     = "hsit12"
  validation {
    condition     = can(regex("^[a-z0-9]{3,6}$", var.name_suffix))
    error_message = "name_suffix must contain 3-6 lowercase letters or digits."
  }
}

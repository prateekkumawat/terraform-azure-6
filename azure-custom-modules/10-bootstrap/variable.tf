
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
}

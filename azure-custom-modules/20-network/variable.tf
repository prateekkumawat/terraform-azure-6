variable "name" {}

variable "resource_group_name" {}

variable "location" {}

variable "address_space" {
  type = list(string)
}
variable "subnet_cidrs" {
  type = object({
    aks = string,
    db  = string,
  pe = string })
}

variable "log_analytics_id" {
  type = string
}

variable "tags" {
  type = map(string)
}
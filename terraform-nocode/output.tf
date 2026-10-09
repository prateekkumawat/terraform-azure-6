output "vnet_id" {
  description = "The ID of the virtual network."
  value       = module.vnet.vnet_id
}

output "subnet_ids" {
  description = "A list of IDs for the subnets created within the virtual network."
  value       = module.vnet.vnet_subnets
}

output "subnet_names" {
  description = "A list of names for the subnets created within the virtual network."
  value       = module.vnet.vnet_subnets_name_id
}




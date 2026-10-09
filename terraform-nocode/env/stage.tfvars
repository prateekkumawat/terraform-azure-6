# vnet setup for stage environment 
resource_group_name = "nodcode-rg"
location = "East US"
vnet_name = "nocode-vnet"   
address_space = ["10.0.0.0/16"]
subnet_names = ["subnet1", "subnet2", "subnet3"]
subnet_prefixes = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
nsg_name = "nocode-nsg"

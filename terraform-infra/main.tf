module "intial_phase" {
  source = "./modules/intial-phase"

  resource_group_details = {
    "rs1" = {
        name = "resource_group_1"
        location = "South India"
    },
    "rs2" = {
        name = "resource_group_2"
        location = "Central India"
    }
  }
}

module "vnet" {
  source = "./modules/vnet"

  vnet_details = {
    "vnet1" = {
        name = "resource_group_1"
        location = "South India"
        vnet-cidr = "10.10.0.0/16"
        vnet-name = "vnet_1"
    },  
    "vnet2" = {
        name = "resource_group_2"
        location = "Central India"
        vnet-cidr = "10.10.0.0/16"
        vnet-name = "vnet_2"
    }
  }

  subnet_details = {
    "subnet1" = {
        address_prefixes   = ["10.10.1.0/24","10.10.2.0/24","10.10.3.0/24"]
        name               = "subnet_1" 
        resource_group_name = "resource_group_1"
        virtual_network_name = "vnet_1" 
        private_endpoint_network_policies             = "Disabled"
        private_link_service_network_policies_enabled = "false"
    }
  } 
}
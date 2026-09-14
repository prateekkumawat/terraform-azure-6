resource_groups = {
  "hsit-apps-1" = {
      name     = "hsit-apps-1"
      location = "Central India" 
  }
  "hsit-apps-2" = {
      name     = "hsit-apps-2"
      location = "South India" 
  }
  "hsit-apps-3" = {
      name     = "hsit-apps-3"
      location = "West India" 
  }
}

vnet = {
  "hsit-vnet-1" = {
      name                = "hsit-vnet-1"
      address_space       = ["10.10.0.0/16"]
      location            = "Central India" 
      resource_group_name = "hsit-apps-1"
  }
  "hsit-vnet-2" = {
        name                = "hsit-vnet-2"
        address_space       = ["10.20.0.0/16"]
        location            = "South India"
        resource_group_name = "hsit-apps-2"
    }    
   "hsit-vnet-3" = {
        name                = "hsit-vnet-3"
        address_space       = ["10.30.0.0/16"]
        location            = "West India"
        resource_group_name = "hsit-apps-3"
    }
}    
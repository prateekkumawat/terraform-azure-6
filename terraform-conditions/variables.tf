variable "project-name" {}
variable "envioernment" {}
variable "location" {
  type = map(string)
   default = {
    stage  = "Central India"
    pp     = "South India"
    prod   = "East US" 
   }
}

variable "network_prefix" {
   type = map(string)
   default = {
     stage = "10.10.0.0/16"
     pp    = "10.100.0.0/16"
     prod  = "10.200.0.0/16"
   }  
}

variable "subnet_prefix" {
   type = map(string)
   default = {
     stage = "10.10.1.0/24"
     pp    = "10.100.1.0/24"
     prod  = "10.200.1.0/24"
   }  
}

variable "vmsize" {
   type = map(string)
   default = {
     stage = "Standard_DS1_v2"
     pp    = "Standerd_D2as_v4"
     prod  = "Standard_D4S_v3"
   }  
}
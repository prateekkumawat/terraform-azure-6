locals {
    locations = var.location[var.envioernment]
}
locals {
    vmsize = var.vmsize[var.envioernment]
}

locals {
  networks = var.network_prefix[var.envioernment]
}

locals {
  subnet_prefix = var.subnet_prefix[var.envioernment]
}
variable "resource_group_details"{
    type = map(object({
        name  =  string
        location = string
    }))
}

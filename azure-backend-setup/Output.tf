output "storage_accounts_names" {
  value = {  
   for k, v in azurerm_storage_account.this1: k => { 
     name   = v.name
     location = v.location 
   }
   }  
}

output "storage_accounts_names_reuse" {
  value = {  
   for k, v in azurerm_storage_account.this2: k => { 
     name   = v.name
     location = v.location 
   }
   }  
}
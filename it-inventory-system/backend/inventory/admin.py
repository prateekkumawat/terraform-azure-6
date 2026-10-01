from django.contrib import admin
from .models import Category, Item, Invoice, InvoiceItem, Transaction

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon', 'created_at')

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('sku', 'name', 'category', 'unit_price', 'quantity_available', 'reorder_level', 'location')
    list_filter = ('category', 'location')
    search_fields = ('name', 'sku')

class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 1

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'vendor_name', 'invoice_date', 'total_amount')
    search_fields = ('invoice_number', 'vendor_name')
    inlines = [InvoiceItemInline]

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_type', 'item', 'quantity', 'unit_price', 'issued_to_or_customer', 'created_at')
    list_filter = ('transaction_type', 'department')
    search_fields = ('item__name', 'issued_to_or_customer', 'notes')

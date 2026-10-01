from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, default='Package')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Item(models.Model):
    sku = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    quantity_available = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=10)
    location = models.CharField(max_length=100, default='Main Storage')
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.sku})"

    @property
    def is_low_stock(self):
        return self.quantity_available <= self.reorder_level

class Invoice(models.Model):
    invoice_number = models.CharField(max_length=100, unique=True)
    vendor_name = models.CharField(max_length=200)
    invoice_date = models.DateField()
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.vendor_name}"

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='invoice_items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='invoice_allocations')
    quantity_received = models.IntegerField(default=0)
    quantity_remaining = models.IntegerField(default=0)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.invoice.invoice_number} - {self.item.name} ({self.quantity_remaining}/{self.quantity_received} left)"

class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('STOCK_IN', 'Stock Received / Purchased'),
        ('SALE_OUT', 'Sold / Issued to Team'),
    )

    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    invoice = models.ForeignKey(Invoice, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='transactions')
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    issued_to_or_customer = models.CharField(max_length=200, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type}: {self.quantity} x {self.item.name}"

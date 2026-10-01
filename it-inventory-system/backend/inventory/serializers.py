from rest_framework import serializers
from .models import Category, Item, Invoice, InvoiceItem, Transaction

class CategorySerializer(serializers.ModelSerializer):
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'items_count', 'created_at']

    def get_items_count(self, obj):
        return obj.items.count()

class ItemSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    is_low_stock = serializers.ReadOnlyField()

    class Meta:
        model = Item
        fields = [
            'id', 'sku', 'name', 'category', 'category_name', 
            'unit_price', 'quantity_available', 'reorder_level', 
            'location', 'description', 'is_low_stock', 
            'created_at', 'updated_at'
        ]

class InvoiceItemSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='item.name')
    item_sku = serializers.ReadOnlyField(source='item.sku')
    quantity_sold_or_issued = serializers.SerializerMethodField()

    class Meta:
        model = InvoiceItem
        fields = [
            'id', 'invoice', 'item', 'item_name', 'item_sku', 
            'quantity_received', 'quantity_remaining', 
            'quantity_sold_or_issued', 'unit_cost'
        ]

    def get_quantity_sold_or_issued(self, obj):
        return obj.quantity_received - obj.quantity_remaining

class InvoiceSerializer(serializers.ModelSerializer):
    invoice_items = InvoiceItemSerializer(many=True, read_only=True)
    total_received_stock = serializers.SerializerMethodField()
    total_available_stock = serializers.SerializerMethodField()
    total_sold_stock = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'vendor_name', 'invoice_date', 
            'total_amount', 'notes', 'invoice_items', 
            'total_received_stock', 'total_available_stock', 
            'total_sold_stock', 'created_at'
        ]

    def get_total_received_stock(self, obj):
        return sum(item.quantity_received for item in obj.invoice_items.all())

    def get_total_available_stock(self, obj):
        return sum(item.quantity_remaining for item in obj.invoice_items.all())

    def get_total_sold_stock(self, obj):
        return sum(item.quantity_received - item.quantity_remaining for item in obj.invoice_items.all())

class TransactionSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='item.name')
    item_sku = serializers.ReadOnlyField(source='item.sku')
    invoice_number = serializers.ReadOnlyField(source='invoice.invoice_number')

    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_type', 'invoice', 'invoice_number', 
            'item', 'item_name', 'item_sku', 'quantity', 
            'unit_price', 'issued_to_or_customer', 'department', 
            'notes', 'created_at'
        ]

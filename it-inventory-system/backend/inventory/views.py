from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction as db_transaction
from django.db.models import Sum, F, Count
from .models import Category, Item, Invoice, InvoiceItem, Transaction
from .serializers import (
    CategorySerializer, ItemSerializer, InvoiceSerializer, 
    InvoiceItemSerializer, TransactionSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all().order_by('name')
    serializer_class = ItemSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'sku', 'category__name', 'location']
    ordering_fields = ['name', 'quantity_available', 'unit_price', 'updated_at']

    @action(detail=True, methods=['post'])
    def adjust_stock(self, request, pk=None):
        item = self.get_object()
        adjustment = request.data.get('adjustment', 0)
        notes = request.data.get('notes', 'Manual Stock Adjustment')
        
        try:
            adj_int = int(adjustment)
        except ValueError:
            return Response({"error": "Invalid adjustment value"}, status=status.HTTP_400_BAD_REQUEST)

        if item.quantity_available + adj_int < 0:
            return Response({"error": "Resulting stock cannot be negative"}, status=status.HTTP_400_BAD_REQUEST)

        with db_transaction.atomic():
            item.quantity_available += adj_int
            item.save()

            trans_type = 'STOCK_IN' if adj_int > 0 else 'SALE_OUT'
            Transaction.objects.create(
                transaction_type=trans_type,
                item=item,
                quantity=abs(adj_int),
                unit_price=item.unit_price,
                issued_to_or_customer='System Adjustment',
                notes=notes
            )

        return Response(ItemSerializer(item).data)

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by('-invoice_date')
    serializer_class = InvoiceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['invoice_number', 'vendor_name', 'notes']

    def create(self, request, *args, **kwargs):
        data = request.data
        invoice_number = data.get('invoice_number')
        vendor_name = data.get('vendor_name')
        invoice_date = data.get('invoice_date')
        notes = data.get('notes', '')
        items_data = data.get('invoice_items', [])

        if not invoice_number or not vendor_name or not invoice_date:
            return Response(
                {"error": "invoice_number, vendor_name, and invoice_date are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Invoice.objects.filter(invoice_number=invoice_number).exists():
            return Response(
                {"error": f"Invoice number '{invoice_number}' already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with db_transaction.atomic():
            total_amount = 0
            invoice = Invoice.objects.create(
                invoice_number=invoice_number,
                vendor_name=vendor_name,
                invoice_date=invoice_date,
                total_amount=0,
                notes=notes
            )

            for item_info in items_data:
                item_id = item_info.get('item')
                qty = int(item_info.get('quantity_received', 0))
                unit_cost = float(item_info.get('unit_cost', 0.0))

                if qty <= 0:
                    continue

                item_obj = Item.objects.get(id=item_id)
                total_amount += qty * unit_cost

                # Create invoice line item
                InvoiceItem.objects.create(
                    invoice=invoice,
                    item=item_obj,
                    quantity_received=qty,
                    quantity_remaining=qty,
                    unit_cost=unit_cost
                )

                # Update Item available quantity
                item_obj.quantity_available += qty
                item_obj.save()

                # Record Stock In Transaction
                Transaction.objects.create(
                    transaction_type='STOCK_IN',
                    invoice=invoice,
                    item=item_obj,
                    quantity=qty,
                    unit_price=unit_cost,
                    notes=f"Stock received via Invoice {invoice_number}"
                )

            invoice.total_amount = total_amount
            invoice.save()

        serializer = self.get_serializer(invoice)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-created_at')
    serializer_class = TransactionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['item__name', 'item__sku', 'invoice__invoice_number', 'issued_to_or_customer', 'department']

    def create(self, request, *args, **kwargs):
        data = request.data
        trans_type = data.get('transaction_type', 'SALE_OUT')
        item_id = data.get('item')
        qty = int(data.get('quantity', 0))
        unit_price = float(data.get('unit_price', 0.0))
        invoice_id = data.get('invoice')
        issued_to = data.get('issued_to_or_customer', '')
        department = data.get('department', '')
        notes = data.get('notes', '')

        if not item_id or qty <= 0:
            return Response({"error": "Item ID and positive quantity are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            item_obj = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({"error": "Item not found."}, status=status.HTTP_404_NOT_FOUND)

        if trans_type == 'SALE_OUT' and item_obj.quantity_available < qty:
            return Response(
                {"error": f"Insufficient stock for {item_obj.name}. Available: {item_obj.quantity_available}, Requested: {qty}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with db_transaction.atomic():
            invoice_obj = None
            if invoice_id:
                try:
                    invoice_obj = Invoice.objects.get(id=invoice_id)
                except Invoice.DoesNotExist:
                    pass

            if trans_type == 'SALE_OUT':
                item_obj.quantity_available -= qty
                item_obj.save()

                # Deduct remaining quantity from InvoiceItem allocations
                remaining_to_deduct = qty
                if invoice_obj:
                    inv_items = InvoiceItem.objects.filter(invoice=invoice_obj, item=item_obj, quantity_remaining__gt=0)
                    for inv_item in inv_items:
                        if remaining_to_deduct <= 0:
                            break
                        deduct = min(inv_item.quantity_remaining, remaining_to_deduct)
                        inv_item.quantity_remaining -= deduct
                        inv_item.save()
                        remaining_to_deduct -= deduct

                # If no specific invoice or remaining left, deduct FIFO from oldest available invoices
                if remaining_to_deduct > 0:
                    fifo_inv_items = InvoiceItem.objects.filter(item=item_obj, quantity_remaining__gt=0).order_by('invoice__invoice_date')
                    for inv_item in fifo_inv_items:
                        if remaining_to_deduct <= 0:
                            break
                        deduct = min(inv_item.quantity_remaining, remaining_to_deduct)
                        inv_item.quantity_remaining -= deduct
                        inv_item.save()
                        remaining_to_deduct -= deduct

            elif trans_type == 'STOCK_IN':
                item_obj.quantity_available += qty
                item_obj.save()

            transaction_obj = Transaction.objects.create(
                transaction_type=trans_type,
                invoice=invoice_obj,
                item=item_obj,
                quantity=qty,
                unit_price=unit_price or item_obj.unit_price,
                issued_to_or_customer=issued_to,
                department=department,
                notes=notes
            )

        serializer = self.get_serializer(transaction_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DashboardView(APIView):
    def get(self, request):
        total_items = Item.objects.count()
        total_stock_count = Item.objects.aggregate(Sum('quantity_available'))['quantity_available__sum'] or 0
        low_stock_items_qs = Item.objects.filter(quantity_available__lte=F('reorder_level'))
        low_stock_count = low_stock_items_qs.count()
        total_invoices_count = Invoice.objects.count()

        sales_qs = Transaction.objects.filter(transaction_type='SALE_OUT')
        total_sales_value = sum(t.quantity * t.unit_price for t in sales_qs)
        total_stock_issued = sales_qs.aggregate(Sum('quantity'))['quantity__sum'] or 0

        # Category Breakdown
        categories = Category.objects.all()
        category_distribution = []
        for cat in categories:
            items_in_cat = cat.items.all()
            qty_sum = items_in_cat.aggregate(Sum('quantity_available'))['quantity_available__sum'] or 0
            val_sum = sum(i.quantity_available * i.unit_price for i in items_in_cat)
            category_distribution.append({
                'id': cat.id,
                'name': cat.name,
                'icon': cat.icon,
                'items_count': items_in_cat.count(),
                'total_stock': qty_sum,
                'total_value': float(val_sum)
            })

        recent_transactions = Transaction.objects.all().order_by('-created_at')[:8]

        return Response({
            'total_items': total_items,
            'total_stock_count': total_stock_count,
            'low_stock_count': low_stock_count,
            'total_invoices_count': total_invoices_count,
            'total_sales_value': float(total_sales_value),
            'total_stock_issued': total_stock_issued,
            'category_distribution': category_distribution,
            'low_stock_items': ItemSerializer(low_stock_items_qs[:5], many=True).data,
            'recent_transactions': TransactionSerializer(recent_transactions, many=True).data,
        })

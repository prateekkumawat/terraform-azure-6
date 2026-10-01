from django.core.management.base import BaseCommand
from inventory.models import Category, Item, Invoice, InvoiceItem, Transaction
import datetime

class Command(BaseCommand):
    help = 'Seeds initial realistic IT team inventory, invoices, and sales transactions data'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Seeding IT Stock & Inventory data..."))

        # 1. Categories
        cat_data = [
            {'name': 'Mice & Keyboards', 'description': 'Ergonomic, wireless, and USB input devices', 'icon': 'Mouse'},
            {'name': 'Cables & Interconnects', 'description': 'HDMI, DisplayPort, USB-C, and Ethernet cables', 'icon': 'Cable'},
            {'name': 'Adapters & Dongles', 'description': 'USB-C hubs, Display adapters, Ethernet dongles', 'icon': 'Cpu'},
            {'name': 'Monitors & Displays', 'description': 'Full HD and 4K displays for workstations', 'icon': 'Monitor'},
            {'name': 'Audio & Video', 'description': 'Headsets, webcams, and speakerphones for meetings', 'icon': 'Headphones'},
            {'name': 'Power & Accessories', 'description': 'Laptop chargers, surge protectors, laptop stands', 'icon': 'Zap'}
        ]

        categories = {}
        for c in cat_data:
            cat_obj, created = Category.objects.get_or_create(
                name=c['name'],
                defaults={'description': c['description'], 'icon': c['icon']}
            )
            categories[c['name']] = cat_obj

        # 2. Items
        items_list = [
            # Mice & Keyboards
            {'sku': 'LOGI-M185', 'name': 'Logitech Wireless Mouse M185', 'cat': 'Mice & Keyboards', 'price': 19.99, 'stock': 45, 'reorder': 15, 'loc': 'Shelf A-1'},
            {'sku': 'LOGI-MX3', 'name': 'Logitech MX Master 3S Ergonomic Mouse', 'cat': 'Mice & Keyboards', 'price': 99.99, 'stock': 12, 'reorder': 5, 'loc': 'Shelf A-2'},
            {'sku': 'DELL-KB216', 'name': 'Dell Wired QuietKey Keyboard KB216', 'cat': 'Mice & Keyboards', 'price': 15.50, 'stock': 38, 'reorder': 10, 'loc': 'Shelf A-3'},
            {'sku': 'LOGI-MK270', 'name': 'Logitech MK270 Wireless Keyboard & Mouse Combo', 'cat': 'Mice & Keyboards', 'price': 29.99, 'stock': 8, 'reorder': 10, 'loc': 'Shelf A-4'},
            
            # Cables
            {'sku': 'CABL-HDMI-6F', 'name': 'High-Speed Braided HDMI 2.1 Cable (6ft)', 'cat': 'Cables & Interconnects', 'price': 12.99, 'stock': 85, 'reorder': 20, 'loc': 'Cabinet B-1'},
            {'sku': 'CABL-DP-6F', 'name': 'DisplayPort to DisplayPort Cable 1.4 (6ft)', 'cat': 'Cables & Interconnects', 'price': 14.50, 'stock': 60, 'reorder': 15, 'loc': 'Cabinet B-2'},
            {'sku': 'CABL-USBC-100W', 'name': 'USB-C to USB-C 100W Power & Data Cable (3ft)', 'cat': 'Cables & Interconnects', 'price': 16.00, 'stock': 5, 'reorder': 15, 'loc': 'Cabinet B-3'},
            {'sku': 'CABL-CAT6-10F', 'name': 'Cat6 Ethernet Patch Cable 550MHz (10ft)', 'cat': 'Cables & Interconnects', 'price': 7.50, 'stock': 120, 'reorder': 30, 'loc': 'Cabinet B-4'},

            # Adapters
            {'sku': 'ADAP-USBC-HUB7', 'name': '7-in-1 USB-C Hub (HDMI, SD, USB 3.0, PD 85W)', 'cat': 'Adapters & Dongles', 'price': 45.00, 'stock': 24, 'reorder': 8, 'loc': 'Drawer C-1'},
            {'sku': 'ADAP-USBC-ETH', 'name': 'USB-C to Gigabit Ethernet RJ45 Adapter', 'cat': 'Adapters & Dongles', 'price': 22.50, 'stock': 4, 'reorder': 10, 'loc': 'Drawer C-2'},
            {'sku': 'ADAP-USBC-HDMI', 'name': 'USB-C to Dual HDMI 4K Adapter', 'cat': 'Adapters & Dongles', 'price': 34.99, 'stock': 18, 'reorder': 5, 'loc': 'Drawer C-3'},

            # Displays & Audio
            {'sku': 'MON-DELL-P24', 'name': 'Dell Professional 24-inch FHD IPS Monitor P2422H', 'cat': 'Monitors & Displays', 'price': 189.00, 'stock': 14, 'reorder': 4, 'loc': 'Bay D-1'},
            {'sku': 'HEAD-JABRA-55', 'name': 'Jabra Evolve 65 UC Wireless Stereo Headset', 'cat': 'Audio & Video', 'price': 149.00, 'stock': 16, 'reorder': 5, 'loc': 'Shelf E-1'},
            {'sku': 'POW-DELL-65W', 'name': 'Dell 65W USB-C AC Laptop Power Adapter', 'cat': 'Power & Accessories', 'price': 49.99, 'stock': 22, 'reorder': 8, 'loc': 'Shelf E-2'}
        ]

        items = {}
        for it in items_list:
            item_obj, created = Item.objects.get_or_create(
                sku=it['sku'],
                defaults={
                    'name': it['name'],
                    'category': categories[it['cat']],
                    'unit_price': it['price'],
                    'quantity_available': it['stock'],
                    'reorder_level': it['reorder'],
                    'location': it['loc'],
                    'description': f"Official IT Team inventory asset: {it['name']}"
                }
            )
            items[it['sku']] = item_obj

        # 3. Invoices (Identifying how stock was acquired)
        invoices_data = [
            {
                'invoice_number': 'INV-2026-088',
                'vendor_name': 'TechSupplies Direct Inc.',
                'date': datetime.date(2026, 1, 15),
                'notes': 'Q1 Bulk Peripheral & Cable Order',
                'items': [
                    {'sku': 'LOGI-M185', 'qty': 50, 'cost': 15.00},
                    {'sku': 'DELL-KB216', 'qty': 40, 'cost': 11.50},
                    {'sku': 'CABL-HDMI-6F', 'qty': 100, 'cost': 8.00},
                    {'sku': 'CABL-CAT6-10F', 'qty': 150, 'cost': 4.50},
                ]
            },
            {
                'invoice_number': 'INV-2026-104',
                'vendor_name': 'Dell Commercial Direct',
                'date': datetime.date(2026, 2, 10),
                'notes': 'Monitors and Ergonomic Gear for New Hires',
                'items': [
                    {'sku': 'MON-DELL-P24', 'qty': 15, 'cost': 160.00},
                    {'sku': 'LOGI-MX3', 'qty': 15, 'cost': 80.00},
                    {'sku': 'ADAP-USBC-HUB7', 'qty': 30, 'cost': 35.00},
                    {'sku': 'POW-DELL-65W', 'qty': 25, 'cost': 38.00},
                ]
            },
            {
                'invoice_number': 'INV-2026-142',
                'vendor_name': 'Global Enterprise Cables Ltd',
                'date': datetime.date(2026, 3, 5),
                'notes': 'High-Speed USB-C & Ethernet Cables',
                'items': [
                    {'sku': 'CABL-USBC-100W', 'qty': 20, 'cost': 11.00},
                    {'sku': 'ADAP-USBC-ETH', 'qty': 15, 'cost': 16.00},
                    {'sku': 'HEAD-JABRA-55', 'qty': 20, 'cost': 120.00},
                ]
            }
        ]

        for inv in invoices_data:
            inv_obj, created = Invoice.objects.get_or_create(
                invoice_number=inv['invoice_number'],
                defaults={
                    'vendor_name': inv['vendor_name'],
                    'invoice_date': inv['date'],
                    'notes': inv['notes'],
                    'total_amount': 0
                }
            )

            if created:
                total = 0
                for line in inv['items']:
                    it_obj = items[line['sku']]
                    qty = line['qty']
                    cost = line['cost']
                    total += qty * cost

                    # Calculate remaining based on current stock
                    rem_qty = min(it_obj.quantity_available, qty)
                    InvoiceItem.objects.create(
                        invoice=inv_obj,
                        item=it_obj,
                        quantity_received=qty,
                        quantity_remaining=rem_qty,
                        unit_cost=cost
                    )

                    Transaction.objects.get_or_create(
                        transaction_type='STOCK_IN',
                        invoice=inv_obj,
                        item=it_obj,
                        quantity=qty,
                        unit_price=cost,
                        notes=f"Invoice {inv_obj.invoice_number} initial stock load"
                    )

                inv_obj.total_amount = total
                inv_obj.save()

        # 4. Record sample stock issued / sales transactions
        sample_sales = [
            {'sku': 'LOGI-M185', 'qty': 5, 'dept': 'DevOps Engineering', 'issued_to': 'Alex Rivera', 'price': 19.99},
            {'sku': 'DELL-KB216', 'qty': 2, 'dept': 'Frontend Development', 'issued_to': 'Sarah Chen', 'price': 15.50},
            {'sku': 'CABL-HDMI-6F', 'qty': 15, 'dept': 'IT Support Desk', 'issued_to': 'Conference Room B', 'price': 12.99},
            {'sku': 'ADAP-USBC-HUB7', 'qty': 6, 'dept': 'Product Design', 'issued_to': 'Marcus Vance', 'price': 45.00},
            {'sku': 'MON-DELL-P24', 'qty': 1, 'dept': 'Data Analytics', 'issued_to': 'Priya Patel', 'price': 189.00},
            {'sku': 'CABL-USBC-100W', 'qty': 15, 'dept': 'Cloud Architecture', 'issued_to': 'Team Deployment Kit', 'price': 16.00},
        ]

        for s in sample_sales:
            it_obj = items[s['sku']]
            Transaction.objects.create(
                transaction_type='SALE_OUT',
                item=it_obj,
                quantity=s['qty'],
                unit_price=s['price'],
                issued_to_or_customer=s['issued_to'],
                department=s['dept'],
                notes=f"Issued to {s['issued_to']} ({s['dept']})"
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded IT inventory system database!"))

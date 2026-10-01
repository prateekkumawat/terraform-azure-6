# IT Team Inventory & Stock Management System

A fully functional, modern IT Team Inventory and Equipment Stock Management Application built using **Python Django REST Framework** for the backend and **React (Vite) + Tailwind CSS** for the user interface.

## Key Features

1. **Invoice Number Stock Traceability**:
   - Every purchase invoice (e.g. `INV-2026-088`, `INV-2026-104`) records incoming stock items with quantities and unit costs.
   - Real-time breakdown per Invoice shows **Received Stock vs Remaining Stock Available vs Sold/Issued Stock**.
   - Track exactly which invoice brought in stock for Mouse, Keyboards, HDMI Cables, Hubs, and Monitors!

2. **IT Equipment & Accessories Catalog**:
   - Pre-loaded with realistic IT hardware: Wireless Mice, Mechanical Keyboards, HDMI/DisplayPort/Ethernet Cables, USB-C Hubs, Dongles, 24" Monitors, Jabra Headsets, and Chargers.
   - Low Stock Alert Thresholds (`reorder_level`) with dynamic warning badges.

3. **Stock Issue / Sales Ledger**:
   - Record equipment issued to team members or sold to departments (DevOps, Design, Engineering, IT Support).
   - Auto-checks remaining stock available before confirming transactions.
   - Link sales directly to specific Invoice Numbers or auto-allocate FIFO.

4. **Executive Dashboard**:
   - KPI Metric Cards (Total Stock Count, Active SKUs, Invoices Tracked, Total Sales Value).
   - Dynamic Bar Charts for stock distribution across IT categories.
   - Low Stock reorder recommendation panel.
   - Live activity timeline.

---

## Quick Start with Docker Compose

To launch the complete system (Django + React UI) using Docker:

```bash
# 1. Navigate into the project folder
cd it-inventory-system

# 2. Build and start containers
docker-compose up --build
```

Access the UI and API:
- **React Frontend**: [http://localhost:3000](http://localhost:3000)
- **Django Backend API**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **Django Admin**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

## Running Locally Without Docker

### 1. Backend (Django)
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations and seed sample IT data
python manage.py makemigrations inventory
python manage.py migrate
python manage.py seed_data

# Start backend server
python manage.py runserver 0.0.0.0:8000
```

### 2. Frontend (React)
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

---

## Architecture & API Endpoints

- `GET /api/dashboard/` - Summary KPIs, category distribution, low stock alerts & recent feed.
- `GET /api/items/` - List & search items filterable by category.
- `POST /api/items/{id}/adjust_stock/` - Quick stock quantity adjustment (+/-).
- `GET /api/invoices/` - Purchase invoices with line item stock remaining breakdown.
- `POST /api/invoices/` - Record new invoice (auto increments item stock).
- `GET /api/transactions/` - Audit log of stock IN and sales/issued OUT.
- `POST /api/transactions/` - Issue/sell equipment (auto validates and decrements stock).

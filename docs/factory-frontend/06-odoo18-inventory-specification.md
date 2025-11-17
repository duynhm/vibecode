# Đặc Tả Chi Tiết Phân Hệ Inventory của Odoo 18

## ⚠️ PHIÊN BẢN: ODOO 18 (Cập Nhật Tháng 11/2025)

> Tài liệu này được tối ưu hóa hoàn toàn cho **Odoo 18** (phiên bản mới nhất).
> Các tính năng, workflow và giao diện đều phù hợp với đặc tả Odoo 18.
> Ngày cập nhật: 17/11/2025

---

## I. TỔNG QUAN VỀ MODULE INVENTORY - ODOO 18

### 1. Định Nghĩa
Phân hệ Inventory (Stock) trong Odoo 18 là một module quản lý tồn kho toàn diện, cho phép các doanh nghiệp theo dõi chuyển động sản phẩm từ nhà cung cấp đến khách hàng. Module này quản lý đơn vị tồn kho, vị trí kho hàng, chuyển di sản phẩm, theo dõi số loạt/số seri, định giá hàng tồn kho, và tự động hóa các quy trình cung cấp với công nghệ AI-driven.

### 2. Các Cải Tiến Chính So Với Phiên Bản Trước

#### 2.1 Thay Đổi Loại Sản Phẩm
**Odoo 17 và Trước:**
- Storable
- Consumable
- Service

**Odoo 18 (Mới):**
- **Goods** (thay thế cả Storable và Consumable)
- **Service**
- **Combo** (NEW - hỗ trợ sản phẩm bundled)

**Cách Phân Biệt Storable vs Consumable:**
- Sử dụng checkbox **"Track Inventory"** (mới)
- ☑ Track Inventory = Storable (theo dõi tồn kho)
- ☐ Track Inventory = Consumable (không theo dõi)

#### 2.2 Tính Năng MTSO (Make to Stock and Order) - MỚI
```
Trước Odoo 18: Phải chọn MTO hoặc MTS
Odoo 18: MTSO - Kết hợp cả hai
├─ Kiểm tra stock có sẵn
├─ Nếu đủ → Lấy từ stock (MTS)
└─ Nếu không đủ → Tạo MO/PO cho số lượng còn lại (MTO)

Lợi ích:
- Giảm chi phí tồn kho
- Tránh stockout
- Tối ưu hóa sản xuất/mua hàng
```

#### 2.3 Wave Picking & Batch Picking - NÂNG CẤP
```
Batch Picking (Tự động):
├─ Nhóm theo Contact
├─ Nhóm theo Carrier
├─ Nhóm theo Destination Country
├─ Nhóm theo Source Location
└─ Nhóm theo Destination Location

Wave Picking (Tự động):
├─ Nhóm theo Product
├─ Nhóm theo Product Category
└─ Nhóm theo Warehouse Location

NEW: Multi-Scan Feature → Quét nhiều sản phẩm cùng lúc
```

#### 2.4 Valuation by Lot/Serial Number - MỚI
```
Odoo 17:
├─ Tất cả lot/serial dùng chung 1 valuation
└─ Dựa trên FIFO/LIFO/AVCO

Odoo 18:
├─ Mỗi lot/serial có valuation riêng
├─ Tính toán cost dựa trên actual cost của lot đó
└─ Áp dụng khi enable: "Valuation by Lot/Serial Number"

Ưu điểm:
- Độ chính xác cao hơn
- Hỗ trợ tốt cho sản phẩm giá thay đổi
- Tốt cho ngành hàng hóa cấp thời gian
```

#### 2.5 Inter-Company Transfers - NÂNG CẤP
```
Tính năng mới:
├─ Transit Location (vị trí trung gian)
├─ Auto-generate counterpart documents
├─ Generate Bills & Invoices tự động
└─ Hỗ trợ multi-company inventory tracking

Workflow:
Company A Delivery
    ↓
Goods → Virtual Location/Inter-company Transit
    ↓
Company B Receipt
    ↓
Transit → Company B Stock
```

#### 2.6 Advanced Forecasting - MỚI
```
AI-Driven Demand Forecasting (NEW):
├─ Phân tích xu hướng bán hàng quá khứ
├─ Dự báo theo mùa
├─ Phân tích biến động thị trường
└─ Cung cấp khuyến nghị tồn kho tự động
```

#### 2.7 Next Transfer Smart Button - MỚI
```
Trước: Phải tìm manual bước tiếp theo
Odoo 18: Click "Next Transfer" button

Ứng dụng:
- 3-step delivery: Pick → Pack → Ship
- Multi-step receipt
- Chuyển đi nội bộ phức tạp

Benefit: Tiết kiệm thời gian, giảm lỗi
```

---

## II. PRODUCT TYPES VÀ CẤU HÌNH - ODOO 18

### 1. Cấu Hình Sản Phẩm Mới

**Product Form - General Information Tab:**
```
┌─────────────────────────────────────┐
│ PRODUCT CONFIGURATION (Odoo 18)    │
├─────────────────────────────────────┤
│ Product Name: [Text]                │
│ Type: ○ Goods ○ Service ○ Combo    │
│                                     │
│ Sales: [☐]   Purchase: [☐]         │
│ Subscription: [☐]   POS: [☐]       │
│                                     │
│ If Type = Goods:                    │
│ └─ ☐ Track Inventory                │
│    (☑ = Storable, ☐ = Consumable)  │
│                                     │
│ Tracking (NEW LOCATION):            │
│ ├─ ○ None                           │
│ ├─ ○ By Lots                        │
│ └─ ○ By Unique Serial Number        │
│                                     │
│ Advanced:                           │
│ ├─ ☐ Valuation by Lot/Serial Number │
│ │   (Enable per-lot valuation)      │
│ └─ Routes: [Multi-select]           │
│                                     │
└─────────────────────────────────────┘
```

### 2. Valuation by Lot/Serial Configuration

**Khi Enable "Valuation by Lot/Serial Number":**
```
Mỗi Lot/Serial có:
├─ Unit Cost riêng
├─ Valuation Entry riêng
└─ Accounting Record riêng

Ví dụ:
Product A
├─ LOT-001: 100 units @ $10 = $1,000
├─ LOT-002: 50 units @ $12 = $600
└─ LOT-003: 75 units @ $11 = $825
Total Value: $2,425

Khi bán:
Sell LOT-002 → Cost = $12 (NOT FIFO average)
```

### 3. Combo Products - MỚI

**Product Type = Combo:**
```
Tính năng mới:
├─ Sản phẩm bundled (kết hợp nhiều sản phẩm)
├─ Hỗ trợ trên Website
├─ Khách hàng chọn combo options
└─ Add to cart từ website

Cấu hình:
├── Type: Combo
├── Combo Choices (General Tab - NEW):
│   ├─ Choice Name
│   └─ Products in Choice (M2M)
└── Pricing: Dynamic based on choices
```

---

## III. THÀNH PHẦN CHÍNH CỦA MODULE INVENTORY

### 1. QUẢN LÝ VỊ TRÍ (LOCATIONS)

#### 1.1 Transit Location (MỚI trong Odoo 18)

**Mục đích:**
```
Vị trí trung gian cho inter-company transfers
├─ Goods từ Company A
├─ Move to Virtual Location/Inter-company Transit
└─ Receive tại Company B
```

**Cấu hình Tự Động:**
```
Khi enable "Inter-Company Transactions":
├─ Odoo tạo tự động:
│  └─ Virtual Location/Inter-company Transit
│
└─ Sử dụng cho all transfers giữa các company
```

### 2. QUẢN LÝ SẢN PHẨM (PRODUCT MASTER) - ODOO 18

#### Thông Tin Cơ Bản (Product Form):
```
General Information Tab:
├── Product Name, Type (NEW options)
├── Track Inventory checkbox
├── Tracking Options (moved here - mới vị trí)
├── Sales/Purchase/Subscription/POS checkboxes
├── Valuation by Lot/Serial Number (nếu tracking)
└── Combo Choices (nếu Type = Combo)

Pricing Tab:
├── Cost Price
├── Sales Price
├── Supplier Info (multi-supplier)
└── Lead Times

Inventory Tab:
├── Reordering Rules
├── Storage Locations
└── Routes (Buy, Manufacture, Dropship, etc.)
```

---

## IV. QUY TRÌNH CHÍNH - ODOO 18

### 1. MTSO - MAKE TO STOCK AND ORDER (MỚI)

#### Cấu Hình MTSO

**Route Setup:**
```
Đi tới: Inventory > Configuration > Routes
├── MTO Route (existing)
├── Cấu hình Pull Rule:
│   ├── Source Location: WH/Stock
│   ├── Destination Location: Customer
│   └── Procure Method: "Take from stock, if not available trigger another rule" ← KEY
│
└── Kết quả: MTSO behavior
```

#### Logic MTSO

```
Sales Order Confirmed for 15 units
├─ On-Hand Qty: 10 units
├─ Check 1: Does stock >= demand?
│   └─ NO → Continue
│
├─ Check 2: Calculate shortage
│   └─ Shortage = 15 - 10 = 5 units
│
├─ Action:
│   ├─ Reservation for 10 units from stock
│   ├─ Create MO/PO for 5 units (shortage only)
│   └─ NO over-ordering
│
└─ Result:
    ├─ 10 units: Fulfilled from stock (fast)
    └─ 5 units: Fulfilled from MO/PO (when ready)
```

#### Giao Diện Sales Order MTSO

```
┌──────────────────────────────────────┐
│ Sales Order: SO/2025/001             │
│ MTSO Product Configuration           │
├──────────────────────────────────────┤
│ Product: Dining Chair                │
│ Requested Qty: 15                    │
│ On Hand: 10                          │
│ Forecasted: 15 (after MO)            │
│ Reserved: 10                         │
│                                      │
│ Deliveries Smart Button:             │
│ ├─ Picking 1: From stock (10 units) │
│ │  └─ Status: To Do                  │
│ │                                    │
│ └─ Picking 2: Waiting for MO (5 u)  │
│    └─ Status: Waiting another move   │
│                                      │
│ MO Smart Button:                     │
│ └─ MO/001: 5 units                   │
│    └─ Status: Confirmed              │
├──────────────────────────────────────┤
│ [Confirm] [Print] [Cancel]           │
└──────────────────────────────────────┘
```

### 2. WAVE PICKING & BATCH PICKING (NÂNG CẤP)

#### 2.1 Kích Hoạt Tính Năng

**Settings:**
```
Inventory > Configuration > Settings
├── Operations Section:
│   └── ☑ Batch, Wave & Cluster Transfers (NEW checkbox)
│
└── Warehouse Section:
    ├── ☑ Storage Locations
    └── ☑ Multi-Step Routes
```

#### 2.2 Batch Picking - Automatic

**Cấu Hình Operation Type:**
```
Operation Types > Pick
├── Batch & Wave Transfers Section (NEW):
│   ├── ☑ Automatic Batches
│   └── Batch Grouping Criteria:
│       ├── ☐ By Contact
│       ├── ☐ By Carrier
│       ├── ☐ By Destination Country
│       ├── ☐ By Source Location
│       └── ☐ By Destination Location
│
└── Result: Odoo auto-groups pickings by selected criteria
```

**Workflow:**
```
Multiple Sales Orders
    ↓
Confirm All
    ↓
Odoo Creates Picking for each
    ↓
Auto-grouping Trigger:
├─ IF same Contact + same Destination
│  THEN group into 1 Batch Picking
│
└─ Result: 3 orders for Contact A
           → 1 Batch Picking for Contact A
```

**Giao Diện Batch Picking:**
```
┌────────────────────────────────────────┐
│ Batch Picking: BATCH/001               │
│ Customer: ABC Ltd                      │
├────────────────────────────────────────┤
│ Batch Type: Automatic                  │
│ Grouped By: Contact                    │
│                                        │
│ Pickings in this Batch:                │
│ ├─ PICK/001 (SO/001: 5 units)         │
│ ├─ PICK/002 (SO/002: 3 units)         │
│ └─ PICK/003 (SO/003: 7 units)         │
│    Total: 15 units                     │
│                                        │
│ Process:                               │
│ ├─ Go to next picking in batch         │
│ └─ [Process Batch] [Validate All]      │
├────────────────────────────────────────┤
│ [Next Transfer] (NEW button)           │
│ [Duplicate] [Print]                    │
└────────────────────────────────────────┘
```

#### 2.3 Wave Picking - Automatic

**Cấu Hình:**
```
Operation Types > Pick
├── Batch & Wave Transfers:
│   ├── ☑ Automatic Batches
│   └── Wave Grouping Criteria:
│       ├── ☐ By Product
│       ├── ☐ By Product Category
│       └── ☐ By Warehouse Location
```

**Workflow:**
```
Multiple Sales Orders
    ↓
Pick Operation Types created
    ↓
Auto-Wave Trigger (Daily or Manual):
├─ Odoo Groups by selected criteria
├─ Example: By Product
│   ├─ All pickings with Product A → Wave 1
│   ├─ All pickings with Product B → Wave 2
│   └─ All pickings with Product C → Wave 3
│
└─ Benefit: Picks from same product shelf area
          → Reduce travel time
```

**Giao Diện Wave Transfer:**
```
┌────────────────────────────────────────┐
│ Wave Transfer: WAVE/001                │
│ Status: Prepared                       │
│ Grouped By: Product                    │
├────────────────────────────────────────┤
│ Transfers in Wave:                     │
│ │                                      │
│ ├─ Picking 1: Product A, 5 units      │
│ ├─ Picking 2: Product A, 3 units      │
│ ├─ Picking 3: Product A, 7 units      │
│ └─ Total: 15 units of Product A       │
│                                        │
│ [Process Wave] [Print Picking List]    │
└────────────────────────────────────────┘
```

### 3. ADVANCED FEATURES NÂNG CẤP

#### 3.1 Next Transfer Smart Button (MỚI)

**Ứng Dụng:**
```
3-Step Delivery:
Step 1: Pick (PICK/001)
    └─ Done → [Next Transfer] → Step 2

Step 2: Pack (PACK/001)
    └─ Done → [Next Transfer] → Step 3

Step 3: Ship (SHIP/001)
    └─ Done → Delivery Complete
```

**Giao Diện:**
```
┌──────────────────────────────────┐
│ Picking: PICK/001                │
├──────────────────────────────────┤
│ [... operations ...]             │
│                                  │
│ Status: Done                     │
│                                  │
│ ┌────────────────────────────┐   │
│ │ [Next Transfer]            │   │
│ │ PACK/001                   │ ← NEW button
│ │ (Packing order ready)      │
│ └────────────────────────────┘   │
└──────────────────────────────────┘
```

#### 3.2 Barcode Enhancements - ODOO 18

**Tính Năng Mới:**
```
1. Manual Barcode Entry:
   ├─ Trước: Chỉ quét được
   └─ Odoo 18: Có thể enter manual (keyboard)

2. Lot/Serial Number Management in Barcode App:
   ├─ View properties
   ├─ Edit lot/serial details
   └─ Batch tracking enhancement

3. Mass Multi-Scan:
   ├─ Quét multiple items cùng lúc
   └─ Batch process all at once

4. RFID Support (via integration):
   ├─ Third-party RFID integration
   └─ Bulk item scanning
```

#### 3.3 Kanban Mass Selection (MỚI)

**Desktop:**
```
ALT + Click → Select multiple Kanban cards
→ Apply bulk actions
```

**Mobile:**
```
Long Press → Select card
→ Multi-select + bulk actions
```

**Ứng Dụng:**
```
Warehouse Team:
├─ View multiple picking cards
├─ ALT + Click multiple cards
├─ [Validate All] → Bulk process
└─ Save time on repetitive tasks
```

---

## V. INTER-COMPANY TRANSFERS - ODOO 18

### 1. Khái Niệm

```
Multi-Company Setup:
├─ Company A (San Francisco)
├─ Company B (Chicago)
└─ Need inventory transfer between them
```

### 2. Cấu Hình

**Step 1: Enable Inter-Company Transactions**
```
Settings > General Settings
├── ☑ Inter-Company Transactions
├── Synchronize Inventory Transfer: ☑
└── Select Stock Operation for each company:
    ├─ San Francisco: "San Francisco: Receipts"
    └─ Chicago: "Chicago: Receipts"
```

**Step 2: Setup Storage Locations & Multi-Step Routes**
```
Inventory > Configuration > Settings
├── ☑ Storage Locations
└── ☑ Multi-Step Routes
```

### 3. Workflow Inter-Company

```
Company A (San Francisco):
├─ Create Delivery Order
├─ Set Delivery Address to Chicago company partner
├─ Validate Delivery
│
↓ Automatic:
├─ Goods moved to Virtual/Inter-company Transit
├─ Counterpart Receipt created in Chicago
│
Company B (Chicago):
├─ Receives counterpart Receipt
├─ Validates Receipt
│
↓ Result:
├─ Company A: Delivery validated
└─ Company B: Stock increased from Transit location
```

### 4. Transit Location

```
Virtual Location Hierarchy:
├─ Virtual Locations/
│  ├─ Inter-company Transit
│  ├─ Scrap
│  └─ Lost/Damaged
│
When inter-company transfer:
├─ Source Company Delivery:
│  ├─ From: WH/Stock
│  └─ To: Virtual/Inter-company Transit
│
├─ Destination Company Receipt:
│  ├─ From: Virtual/Inter-company Transit
│  └─ To: WH/Stock
```

### 5. Accounting Impact

```
Auto-Generated Documents:
├─ IF enable "Generate Bills":
│  ├─ Company A: Sale Order (at cost or custom price)
│  └─ Company B: Purchase Order
│
└─ IF enable "Generate Sale Orders":
   └─ Inter-company sale for tracking
```

---

## VI. INVENTORY ADJUSTMENTS - REAL-TIME (ODOO 18)

### Tính Năng Mới: Real-Time Inventory Adjustments

**Trước Odoo 18:**
```
Product Form → Create Adjustment → Validate
→ Time-consuming
```

**Odoo 18:**
```
Product Form
├── Inventory Tab (NEW):
│   ├── "On Hand Qty" field
│   ├── Direct edit capability
│   └── Click Save → Auto-create adjustment
│
OR

Product List View (NEW):
├── Click on Qty
├── Edit directly
└── Save → Auto-adjustment
```

**Giao Diện:**
```
┌────────────────────────────────┐
│ Product: Product A             │
│                                │
│ Inventory Info:                │
│ ├─ On Hand: [100    ] ← editable│
│ ├─ Reserved: 20                │
│ ├─ Available: 80               │
│ └─ Forecasted: 100             │
│                                │
│ [Save] → Auto-adjustment       │
│         Created                │
└────────────────────────────────┘
```

---

## VII. ADVANCED REPORTING - ODOO 18

### 1. Menu Revamp

```
Inventory > Reporting (REVAMPED):
├── Stock at Date
├── Inventory Movements
├── Traceability
├── Stock Valuation
├── Forecasted Quantities (AI-powered)
├── Analysis
└── (Additional reports)
```

### 2. Valuation with Lot/Serial Tracking

```
Stock Valuation Report:
├── Product: Product A
│   ├─ LOT-001: 100 @ $10 = $1,000
│   ├─ LOT-002: 50 @ $12 = $600
│   └─ LOT-003: 75 @ $11 = $825
│   Total: $2,425
│
└── Each lot shows separate valuation
    (NOT averaged)
```

### 3. AI-Driven Forecasting (NEW)

```
Advanced Demand Forecasting:
├── Analyzes past sales trends
├── Considers seasonal patterns
├── Predicts market fluctuations
├── Recommends stock levels
└── Helps avoid stockouts/overstock
```

---

## VIII. BARCODE MODULE ENHANCEMENTS - ODOO 18

### 1. Batch Processing in Barcode App

```
Mobile App:
├── Scanner OR Keyboard entry (NEW)
├── Scan multiple items
├── System auto-batches
└── Bulk validation
```

### 2. Lot/Serial Editing in Barcode App

```
Before: View-only lot/serial
Odoo 18: Can edit properties directly
├── Expiry date
├── Lot details
└── Serial number properties
```

### 3. Multi-Scan Capability

```
Enhanced scanning:
├── Mass QR code scanning
├── Multiple serial numbers
├── Bulk update quantities
└── Reduced manual entry
```

---

## IX. QUYTRÌNH NHẬN HÀNG (INBOUND) - ODOO 18

### 1.1 Automatic Batch/Serial Number Generation (MỚI)

```
Receipt Process (Odoo 18):
├─ Scan product barcode
├─ System checks: "Is tracking enabled?"
│   └─ YES:
│       ├─ Auto-generate Batch/Serial Number
│       ├─ Show: "Batch #: AUTO-20251117-001"
│       └─ NO manual entry needed
│
└─ Benefit: Faster receipt processing
```

### 1.2 Product Auto-Detection (MỚI)

```
If Product not in system:
├─ Scan unknown barcode
├─ System scans database
├─ NOT FOUND:
│   └─ Create new product profile AUTO:
│       ├─ Title: from barcode data
│       ├─ Category: default/suggested
│       ├─ Supplier: extracted
│       └─ Barcode: linked
│
Benefit: No manual product creation needed
```

---

## X. PRODUCT TRACKING - CUSTOMER LOT REPORTS (MỚI)

### 1. Customer Lot Report

```
Customer Record (res.partner):
├── NEW Smart Button: "Product Deliveries"
│   └── Shows all products delivered to customer
│       by lot/serial number
│
Example:
Customer: ABC Ltd
├─ Product A, LOT-001, 100 units, 2025-11-01
├─ Product A, LOT-002, 50 units, 2025-11-05
├─ Product B, SN-123, 1 unit, 2025-11-10
└─ [Report] [Trace] buttons available
```

### 2. Traceability Enhancement

```
From Customer → Product Journey
├── All lots/serials sold to this customer
├── Links to original purchases (POs)
├── Warranty/recall tracking
└── Quality issue tracking by customer
```

---

## XI. EMPTY LOCATIONS VISIBILITY (MỚI)

### Tính Năng

```
Inventory > Configuration > Locations
├── List View Enhancement:
│   ├── Color-coded empty locations
│   ├── Filter: "Empty Locations"
│   └── Quick replenishment trigger
│
Benefit:
├── Warehouse optimization
├── Identify dead storage space
└── Plan inventory redistribution
```

---

## XII. RETURN ORDERS - ENHANCED (ODOO 18)

### Tính Năng Mới: Create Replenishment on Return

```
Return Order Processing:
├─ When creating return (from delivery)
├─ Option: "Create new transfer to send replacement"
│   └─ Auto-creates transfer for new goods
│
Workflow:
├─ Delivery done
├─ Customer returns items
├─ Click "Return" → Reverse receipt created
├─ Simultaneously:
│   └─ "Send replacement" → New picking created
│
Result: Both return + replacement tracked
```

---

## XIII. PACKAGE MANAGEMENT - KANBAN VIEW (MỚI)

### Tính Năng

```
Packages View (NEW):
├── Move packages using Kanban
├── NO need to create transfer
├── Drag-drop packages between locations
├── Bulk kanban operations
│
Example:
├─ Package is at WH/Packing
├─ Drag to WH/Output (via Kanban)
├─ NO transfer needed
└─ Location updated instantly
```

---

## XIV. LOCATION CHECKBOXES - ENHANCEMENT

### Tính Năng Mới: Show Empty Location Status

```
Location List View:
├── "Is Empty" checkbox visible
├── Easy identify unused locations
└── Filter/sort by this field

Use Case:
├── Warehouse optimization
├── Identify storage consolidation opportunities
└── Plan rack/shelf removal
```

---

## XV. CONFIGURATION CHECKLIST - ODOO 18

### Pre-Launch Setup

```
☑ Odoo 18 Installation Verified
☑ Settings:
  ☑ Enable Track Inventory (for Goods)
  ☑ Enable Storage Locations
  ☑ Enable Multi-Step Routes
  ☑ Enable Batch, Wave & Cluster Transfers (NEW)
  ☑ Enable Inter-Company Transactions (if applicable)
  ☑ Advanced Forecasting (optional)

☑ Product Configuration:
  ☑ Update product types: Goods/Service/Combo
  ☑ Enable "Track Inventory" checkbox
  ☑ Configure tracking: None/Lot/Serial
  ☑ Enable "Valuation by Lot/Serial" (if needed)
  ☑ Set Routes: MTSO/MTO/MTS

☑ Warehouse Setup:
  ☑ Configure warehouse locations
  ☑ Set receipt steps (1/2/3)
  ☑ Set delivery steps (1/2/3)
  ☑ Enable Batch grouping per operation type
  ☑ Configure Wave grouping criteria

☑ Barcode:
  ☑ Configure product barcodes
  ☑ Enable barcode scanning
  ☑ Test multi-scan
  ☑ Test manual entry (NEW)

☑ Testing:
  ☑ Test MTSO workflow
  ☑ Test Batch picking auto-grouping
  ☑ Test Wave picking
  ☑ Test [Next Transfer] button
  ☑ Test Lot valuation separation
  ☑ Test inter-company transfers (if applicable)
  ☑ Test real-time inventory adjustment (NEW)
  ☑ Test customer lot report (NEW)
  ☑ Verify valuation by lot/serial (NEW)

☑ Training:
  ☑ Warehouse staff: Batch/Wave picking
  ☑ Warehouse staff: Multi-scan barcode
  ☑ Finance: Lot-based valuation
  ☑ Admin: Inter-company setup
```

---

## XVI. TROUBLESHOOTING - ODOO 18 SPECIFIC

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| MTSO not working | Pull rule not configured correctly | Set supply method to "Take from stock, if not available trigger another rule" |
| Batch not auto-grouping | Setting not enabled | Enable "Batch, Wave & Cluster Transfers" in settings |
| Wave not creating | Criteria not met | Check automatic batch configuration, ensure products match grouping criteria |
| Lot valuation showing average | Feature not enabled | Enable "Valuation by Lot/Serial Number" in product |
| Inter-company transfer stuck | Transit location not created | Auto-created when inter-company enabled, verify locations exist |
| Manual barcode entry not working | Setting disabled | Barcode module allows manual entry in Odoo 18 |
| Next Transfer not showing | Previous step not completed | Validate/complete current step first |

---

## XVII. PERFORMANCE OPTIMIZATION - ODOO 18

### 1. Database Indexing
- Product search: Indexed (Barcode, Code, Name)
- Location hierarchy: Tree index (fast traversal)
- Stock moves: Indexed (Picking, Product, State)
- Lot/Serial: Indexed for fast lookup

### 2. Caching Strategy
- Product masters: Cached (1-hour TTL)
- Stock quantities: On-demand computed
- Forecasted quantities: Daily refresh (batch job)
- Wave grouping: Computed on demand

### 3. Batch Operations
- Wave creation: Async task (large volumes)
- Forecasting: Background job (nightly)
- Valuation updates: Batch processing

---

## XVIII. ODOO 18 API & CUSTOMIZATION NOTES

### 1. Key Models
```
stock.move
├── Fields changed: Lot/Serial structure
├── New fields: wave_id, batch_id
└── New methods: _generate_serial_number()

stock.picking
├── New smart button: next_transfer_id
├── New field: is_wave_transfer
└── New methods: get_next_transfer()

stock.location
├── New field: is_empty
└── New computed field: is_virtual

product.product
├── Removed: product_type (replaced with type + track_inventory)
├── New field: valuation_by_lot_serial
└── New field: combo_ids
```

### 2. Customization Points
```
Wave Grouping:
├── Extensible grouping rules
├── Custom criteria possible
└── Override: _get_wave_grouping_criteria()

Barcode:
├── Custom barcode format support
├── Batch processing hooks
└── Override: barcode_format()

MTSO:
├── Custom procurement logic
├── Configurable shortage threshold
└── Override: _compute_shortage()
```

---

## XIX. MIGRATION FROM ODOO 17 → ODOO 18

### 1. Data Migration

```
Product Types:
├── Storable → Goods + Track Inventory ✓
├── Consumable → Goods ✓
└── Service → Service ✓

Inventory Valuation:
├── Existing records preserved ✓
├── Lots separate if enabled ✓
└── FIFO/LIFO/AVCO methods work ✓

Locations:
├── All preserved ✓
├── Inter-company transit auto-created ✓
└── Empty status auto-computed ✓

Routes:
├── MTO → MTSO (if pull rule modified) ✓
├── Custom routes tested ✓
└── Wave/Batch settings fresh ✓
```

### 2. Configuration Required

```
☑ Review all product types
☑ Enable new checkboxes/settings
☑ Test MTSO on critical products
☑ Train staff on new barcode features
☑ Verify inter-company setup
☑ Review lot valuation impact on accounting
```

---

## XX. ODOO 18 ADVANTAGES FOR FRONT-END DESIGN

### 1. Simplified UI Components
```
OLD (Multi-step product form):
├─ Storable tab
├─ Consumable tab
└─ Inventory tab
Total: 3+ tabs

NEW (Consolidated):
├─ General tab
│  ├─ Type: Goods/Service/Combo
│  ├─ Track Inventory checkbox
│  └─ Tracking options
└─ Inventory tab (focused)

Benefit: Cleaner, more intuitive form
```

### 2. Enhanced Mobile Experience
```
Barcode App:
├─ Manual entry support
├─ Multi-scan in one go
├─ Batch processing
├─ Real-time feedback
└─ Offline capability (improved)
```

### 3. Better Analytics/Dashboard
```
Dashboard Cards:
├─ Wave picking progress
├─ Batch processing status
├─ AI forecasting recommendations
├─ Lot/serial expiry alerts
└─ Empty location indicators
```

---

## XXI. FREQUENTLY USED WORKFLOWS - ODOO 18

### 1. Simple Receipt → Delivery (MTSO)

```
Day 1:
└─ Create PO (Qty: 20)
   Supplier: ABC Corp
   Price: $10/unit

Day 2:
└─ Receive goods
   └─ Validate receipt
   └─ Auto-add to WH/Stock

Day 3:
└─ Sales Order arrives (Qty: 25)
   └─ Check stock: 20 available
   └─ Auto-order 5 more units
   └─ Reserve 20 from stock
   └─ Create picking for 20
   └─ Create MO/PO for 5

Day 4:
└─ Validate delivery (20 units)
   └─ Wait for additional 5 from MO/PO

Day 5:
└─ MO/PO ready (5 units)
   └─ Pick + Deliver remaining 5
   └─ Sales order complete
```

### 2. Wave Picking with Auto-Batching

```
Multiple Sales Orders (same day):
├─ SO1: Product A, 5 units, Contact X
├─ SO2: Product B, 10 units, Contact Y
└─ SO3: Product A, 8 units, Contact X

Wave Grouping by Product:
├─ Wave 1: All Product A (5+8=13)
├─ Wave 2: All Product B (10)
└─ Warehouse picks by wave

Result:
├─ Faster picking (same shelf)
├─ Reduced travel
├─ Higher efficiency
```

### 3. Inter-Company Transfer with Auto-Accounting

```
Company A (SF) to Company B (Chicago):
├─ Create delivery in SF (10 units, price: $100)
├─ Validate delivery
│   ├─ Goods → Transit location
│   └─ Auto-create receipt in Chicago
│
├─ Auto-generate sale order in SF
│   └─ SO: 10 units @ $100 (or cost)
│
├─ Switch to Chicago company
├─ Auto-receipt created
├─ Validate receipt
│   └─ Goods → Chicago stock
│
└─ Auto-generate purchase order in Chicago
    └─ PO: 10 units @ $100 (or cost)

Result:
├─ SF: Sales recorded
├─ Chicago: Purchase recorded
├─ Inventory synchronized
└─ Accounting entries created
```

---

## CONCLUSION

Phân hệ Inventory của **Odoo 18** mang đến các cải tiến đáng kể về automation, flexibility, và user experience. Tài liệu này cung cấp đặc tả hoàn toàn phù hợp cho việc phân tích, thiết kế và phát triển giao diện front-end mới.

**Các điểm chính:**
- ✅ MTSO (Make to Stock and Order) - Kết hợp MTO + MTS
- ✅ Wave/Batch Picking - Tự động hóa picking
- ✅ Lot/Serial Valuation - Định giá riêng theo lô
- ✅ Inter-Company Transfers - Quản lý đa công ty
- ✅ Advanced Barcode - Quét nhiều, nhập thủ công
- ✅ Real-time Adjustments - Cập nhật tức thì
- ✅ Next Transfer Navigation - Dễ dàng chuyển bước
- ✅ AI Forecasting - Dự báo thông minh

**Phiên bản**: Odoo 18 (Cập nhật 11/2025)
**Sử dụng cho**: Thiết kế giao diện front-end mới
**Mức độ chi tiết**: Comprehensive + Odoo 18 specific

---

## Application to Factory Frontend Project

### Mapping Phase 2 Features to Odoo 18 Specifications

**Đã triển khai trong Phase 2:**
1. ✅ Product Detail Page → Maps to Product Master (Section II.2)
2. ✅ Stock Transfers → Maps to Stock Picking workflows (Section IV)
3. ✅ Barcode Scanner → Maps to Barcode Module (Section VIII)
4. ✅ Stock Adjustments → Maps to Real-time Adjustments (Section VI)

**Đề xuất cho Phase 3:**
1. Wave/Batch Picking implementation (Section IV.2)
2. Next Transfer Smart Button (Section IV.3.1)
3. Lot/Serial Number tracking (Section II.2)
4. Multi-step delivery routes (Section IV.1)

**Cải tiến tương lai:**
1. MTSO routing logic
2. AI-driven forecasting dashboard
3. Inter-company transfers (nếu có multi-company)
4. Advanced reporting & analytics

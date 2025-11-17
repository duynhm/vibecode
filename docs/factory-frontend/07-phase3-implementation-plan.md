# Phase 3 Implementation Plan - Advanced Inventory Features

## 📋 Overview

Phase 3 triển khai các tính năng nâng cao từ Odoo 18 Inventory specification, tập trung vào:
- Lot/Serial Number Tracking
- Batch & Wave Picking
- Multi-step Delivery Routes
- Product Traceability
- Advanced Operations

---

## 🎯 Features Priority List

### Priority 1: LOT/SERIAL NUMBER TRACKING (Cao nhất)

#### 1.1 Lot/Serial Number Management

**Data Model:**
```typescript
// types/index.ts
export interface LotSerial {
  id: number
  name: string
  product_id: [number, string]
  product_qty: number
  company_id: [number, string]
  create_date: string
  expiration_date?: string
  use_date?: string
  removal_date?: string
  alert_date?: string
  note?: string
}
```

**Mock Data:**
```json
// data/lot-serials.json
[
  {
    "id": 1,
    "name": "LOT-LAV-20251101",
    "product_id": [1, "Tinh dầu Lavender nguyên chất"],
    "product_qty": 25.5,
    "company_id": [1, "Công ty mỹ phẩm"],
    "create_date": "2025-11-01",
    "expiration_date": "2026-11-01",
    "use_date": "2026-10-01",
    "alert_date": "2026-09-01",
    "note": "Nhập từ nhà cung cấp Tinh dầu Thiên Nhiên"
  }
]
```

**UI Components:**

1. **Lot/Serial List Page** (`/lots`)
   - Filter by product, expiration status
   - Color-coded expiry alerts (Red: expired, Orange: expiring soon, Green: ok)
   - Search by lot/serial number
   - Quick actions: View traceability, Edit

2. **Lot/Serial Detail Page** (`/lots/[id]`)
   - Lot information card
   - Stock by location for this lot
   - Movement history (all transfers)
   - Traceability report (upstream & downstream)
   - Expiry date management

3. **Product Detail Enhancement**
   - Add "View by Lot" tab
   - Show all lots with quantities
   - Link to lot detail pages

#### 1.2 Stock Quant Enhancement với Lot/Serial

**Update StockQuant Type:**
```typescript
export interface StockQuant {
  id: number
  product_id: [number, string]
  location_id: [number, string]
  quantity: number
  reserved_quantity: number
  lot_id?: [number, string]  // Already have this
  package_id?: [number, string]
  owner_id?: [number, string]
}
```

**Update stock-quants.json:**
- Assign lot_id cho các sản phẩm có tracking
- Mỗi lot ở mỗi location = 1 quant record

---

### Priority 2: BATCH PICKING (Quan trọng)

#### 2.1 Batch Transfer Model

**Data Model:**
```typescript
export interface BatchTransfer {
  id: number
  name: string // BATCH/001
  picking_ids: number[]
  user_id: [number, string]
  state: 'draft' | 'in_progress' | 'done' | 'cancel'
  batch_type: 'automatic' | 'manual'
  grouped_by: 'contact' | 'carrier' | 'location' | 'destination'
  scheduled_date: string
  pickings_count: number
}
```

**Mock Data:**
```json
// data/batch-transfers.json
[
  {
    "id": 1,
    "name": "BATCH/001",
    "picking_ids": [1, 2, 3],
    "user_id": [1, "Admin"],
    "state": "in_progress",
    "batch_type": "automatic",
    "grouped_by": "contact",
    "scheduled_date": "2024-11-20T08:00:00Z",
    "pickings_count": 3
  }
]
```

**UI Pages:**

1. **Batch List Page** (`/batches`)
   - Kanban view of batches
   - Filter by state, user, date
   - Card shows: Batch name, pickings count, progress
   - Quick actions: Process, View details

2. **Batch Detail Page** (`/batches/[id]`)
   - Batch header with status
   - List of pickings in batch
   - Consolidated product list across all pickings
   - Process batch workflow:
     - Pick all items in one go
     - Validate batch (validates all pickings)
   - Print batch picking list

#### 2.2 Auto-Grouping Logic

**MockDataService Enhancement:**
```typescript
// lib/mock/batch.ts
export class BatchService {
  static async createAutoBatches(
    pickings: StockPicking[],
    criteria: 'contact' | 'location'
  ): Promise<BatchTransfer[]> {
    // Group pickings by criteria
    // Generate batch records
    // Return batches
  }
}
```

---

### Priority 3: WAVE PICKING

#### 3.1 Wave Transfer Model

**Data Model:**
```typescript
export interface WaveTransfer {
  id: number
  name: string // WAVE/001
  picking_ids: number[]
  user_id: [number, string]
  state: 'draft' | 'confirmed' | 'in_progress' | 'done' | 'cancel'
  wave_type: 'automatic' | 'manual'
  grouped_by: 'product' | 'category' | 'location'
  scheduled_date: string
  pickings_count: number
}
```

**UI Pages:**

1. **Wave List Page** (`/waves`)
   - Similar to Batch list
   - Filter by product/category
   - Wave status indicators

2. **Wave Detail Page** (`/waves/[id]`)
   - Wave overview
   - Grouped by product view
   - Consolidated picking list
   - Print wave sheet

---

### Priority 4: NEXT TRANSFER NAVIGATION

#### 4.1 Transfer Chain Logic

**Implementation:**
- Add `next_transfer_id` field to StockPicking
- Mock data update: Link related transfers
- UI: Smart button on transfer detail page

**Example Chain:**
```
PICK/001 → PACK/001 → SHIP/001
(next_transfer_id = 2) → (next_transfer_id = 3) → (next_transfer_id = null)
```

**UI Component:**
```tsx
{picking.next_transfer_id && (
  <Card>
    <CardContent>
      <Button onClick={() => navigate to next}>
        Next Transfer: {next_transfer.name}
      </Button>
    </CardContent>
  </Card>
)}
```

---

### Priority 5: MULTI-STEP DELIVERY ROUTES

#### 5.1 Warehouse Configuration

**Data Model:**
```typescript
export interface WarehouseConfig {
  id: number
  name: string
  code: string
  reception_steps: '1step' | '2steps' | '3steps'
  delivery_steps: '1step' | '2steps' | '3steps'
  pick_location_id: [number, string]
  pack_location_id: [number, string]
  output_location_id: [number, string]
}
```

#### 5.2 3-Step Delivery Workflow

**Scenario: Sales Order → Delivery**
```
Step 1: PICK/001
  From: WH/Stock
  To: WH/Packing
  Products: Pick from shelves
  Status: Ready → Done → [Next Transfer]

Step 2: PACK/001
  From: WH/Packing
  To: WH/Output
  Products: Pack items
  Status: Waiting → Ready → Done → [Next Transfer]

Step 3: SHIP/001
  From: WH/Output
  To: Customer
  Products: Ship
  Status: Waiting → Ready → Done
```

**Mock Data Setup:**
- Create chain of pickings
- Link with next_transfer_id
- Update picking types

---

### Priority 6: PRODUCT TRACEABILITY

#### 6.1 Traceability Report

**UI Page: `/traceability`**

**Features:**
- Search by Product, Lot/Serial, or Reference
- Upstream traceability (where did it come from?)
  - PO → Receipt → Lot → Location
- Downstream traceability (where did it go?)
  - Location → Lot → Picking → Delivery → Customer

**Visual:**
```
Flowchart:
Supplier → PO/00042 → RECEIPT/001 → LOT-LAV-20251101 → WH/Stock/A
                                                           ↓
                                            PICK/001 → PACK/001 → SHIP/001 → Customer ABC
```

#### 6.2 Customer Lot Report

**Enhancement to Customer view:**
```tsx
// On product detail page, add customer deliveries section
{product.tracking !== 'none' && (
  <Card>
    <CardHeader>
      <CardTitle>Deliveries by Lot</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Table: Lot | Customer | Qty | Date | Picking */}
    </CardContent>
  </Card>
)}
```

---

## 📊 Implementation Roadmap

### Week 1: Lot/Serial Tracking (3-4 days)
- [ ] Day 1: Data models, mock data, types
- [ ] Day 2: Lot list & detail pages
- [ ] Day 3: Product detail enhancement với lot view
- [ ] Day 4: Stock quant by lot, testing

### Week 2: Batch & Wave Picking (3-4 days)
- [ ] Day 1: Batch transfer data model & mock data
- [ ] Day 2: Batch list & detail pages
- [ ] Day 3: Wave transfer pages
- [ ] Day 4: Auto-grouping logic, testing

### Week 3: Multi-step Routes & Traceability (3 days)
- [ ] Day 1: Next transfer navigation
- [ ] Day 2: Multi-step delivery mock data & UI
- [ ] Day 3: Traceability report page

### Week 4: Polish & Testing (2 days)
- [ ] Integration testing
- [ ] Bug fixes
- [ ] Documentation updates
- [ ] Commit & push

---

## 🗂️ File Structure

```
factory-frontend/
├── app/(dashboard)/
│   ├── lots/
│   │   ├── page.tsx           # Lot/Serial list
│   │   └── [id]/page.tsx      # Lot detail
│   ├── batches/
│   │   ├── page.tsx           # Batch list
│   │   └── [id]/page.tsx      # Batch detail
│   ├── waves/
│   │   ├── page.tsx           # Wave list
│   │   └── [id]/page.tsx      # Wave detail
│   └── traceability/
│       └── page.tsx           # Traceability report
├── data/
│   ├── lot-serials.json       # NEW
│   ├── batch-transfers.json   # NEW
│   └── wave-transfers.json    # NEW
├── types/index.ts             # Update with new types
└── lib/mock/
    ├── batch.ts               # NEW - Batch logic
    ├── wave.ts                # NEW - Wave logic
    └── traceability.ts        # NEW - Traceability logic
```

---

## 🎨 UI/UX Considerations

### Color Coding
- **Lot Expiry**:
  - Red: Expired
  - Orange: Expiring in < 30 days
  - Yellow: Expiring in < 60 days
  - Green: > 60 days

- **Batch/Wave Status**:
  - Blue: In progress
  - Green: Done
  - Gray: Draft
  - Red: Cancelled

### Tablet Optimization
- Large batch cards for easy selection
- Consolidated product list with checkboxes
- Swipe gestures for batch navigation
- Quick validate button (prominent)

### Performance
- Lazy load lot lists (pagination)
- Cache batch/wave data
- Efficient grouping algorithms

---

## 🧪 Testing Checklist

### Lot/Serial Tracking
- [ ] Create lot with expiry date
- [ ] View lot detail with stock locations
- [ ] Track lot through transfers
- [ ] Filter by expiry status
- [ ] Search by lot number

### Batch Picking
- [ ] Create manual batch
- [ ] Auto-group pickings by contact
- [ ] Process batch workflow
- [ ] Validate all pickings in batch
- [ ] Print batch picking list

### Wave Picking
- [ ] Create wave grouped by product
- [ ] View consolidated product list
- [ ] Process wave
- [ ] Validate wave transfers

### Next Transfer
- [ ] Navigate from PICK to PACK
- [ ] Navigate from PACK to SHIP
- [ ] Button disabled on final step

### Traceability
- [ ] Trace product upstream (to supplier)
- [ ] Trace product downstream (to customer)
- [ ] Trace by lot number
- [ ] View full movement history

---

## 📚 Documentation Updates

After implementation:
- [ ] Update README with Phase 3 features
- [ ] Add screenshots to docs
- [ ] Update API documentation (mock service)
- [ ] Create user guide for warehouse staff
- [ ] Update setup.sh script

---

## 🚀 Quick Start Commands

```bash
# Checkout branch
git checkout claude/build-odoo-frontend-016N9DXnWvHkcs6CcJ9Ua23M

# Start development
cd factory-frontend
npm run dev

# Test build
npm run build

# Commit progress
git add .
git commit -m "Implement Phase 3: [feature name]"
git push
```

---

## ✅ Success Criteria

Phase 3 is complete when:
- ✅ All lot/serial CRUD operations work
- ✅ Batch picking creates and processes batches
- ✅ Wave picking groups by product/category
- ✅ Next transfer navigation works in multi-step routes
- ✅ Traceability report shows full product journey
- ✅ All pages are tablet-optimized
- ✅ Build passes without errors
- ✅ Documentation is updated

---

## 📝 Notes

**Out of Scope for Phase 3:**
- MTSO routing logic (requires Odoo integration)
- AI forecasting (requires historical data)
- Inter-company transfers (requires multi-company setup)
- Real Odoo API integration

**Future Enhancements:**
- Barcode integration with lot scanning
- Mobile notifications for batch assignments
- Real-time dashboard for wave progress
- Advanced analytics

---

**Document Version**: 1.0
**Created**: 2025-11-17
**Status**: Ready for Implementation

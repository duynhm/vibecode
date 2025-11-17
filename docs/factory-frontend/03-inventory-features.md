# Inventory Module - Full Feature Specifications

## Odoo 18 Models Mapping

### Core Models
```python
# Odoo models we'll interact with
stock.location          # Warehouse locations
stock.warehouse         # Warehouses
product.product         # Products/Items
product.template        # Product templates
stock.quant             # Stock quantities by location
stock.picking           # Transfers (IN/OUT/Internal)
stock.move              # Stock moves (line items)
stock.move.line         # Detailed move lines (with lot/serial)
stock.inventory         # Stock adjustments/counts (Odoo 18: stock.quant update)
stock.lot               # Lot/Serial numbers
uom.uom                 # Units of measure
```

---

## Feature 1: Product Management

### 1.1 Product List View

**UI Layout:**
```
┌─────────────────────────────────────────────────┐
│ [Search] [Filter] [Scan Barcode] [+ New]       │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 📦 Product A (SKU: PROD-001)              │ │
│  │ Barcode: 1234567890                       │ │
│  │ Category: Raw Materials                   │ │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │
│  │ Available: 150 Units | Reserved: 20       │ │
│  │ [View Details] [Adjust Qty]               │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 📦 Product B (SKU: PROD-002)              │ │
│  │ ...                                       │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

**API Endpoints:**
```typescript
// GET /api/inventory/products
interface ProductListParams {
  search?: string
  category_id?: number
  location_id?: number
  limit?: number
  offset?: number
}

interface Product {
  id: number
  name: string
  default_code: string // SKU
  barcode: string
  type: 'product' | 'consu' | 'service'
  categ_id: [number, string] // [id, name]
  uom_id: [number, string]
  qty_available: number
  virtual_available: number
  incoming_qty: number
  outgoing_qty: number
  image_128: string // base64 image
}
```

**Features:**
- ✅ Search by name/SKU/barcode
- ✅ Filter by category, type, location
- ✅ Sort by name, qty, recent updates
- ✅ Barcode scanner integration
- ✅ Infinite scroll or pagination
- ✅ Quick view modal

---

### 1.2 Product Detail View

**UI Layout:**
```
┌─────────────────────────────────────────────────┐
│ [← Back]                      [Edit] [Delete]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────┐  Product A                           │
│  │ IMG  │  SKU: PROD-001                        │
│  │      │  Barcode: 1234567890                  │
│  └──────┘  Category: Raw Materials              │
│                                                 │
│  ┌─── Stock Information ───────────────────┐   │
│  │ Available Qty:     150 Units            │   │
│  │ Reserved:          20 Units             │   │
│  │ Forecasted:        130 Units            │   │
│  │ Incoming:          50 Units             │   │
│  │ Outgoing:          30 Units             │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─── Stock by Location ───────────────────┐   │
│  │ WH/Stock          100 Units             │   │
│  │ WH/Stock/Shelf A   30 Units             │   │
│  │ WH/Stock/Shelf B   20 Units             │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─── Recent Moves ─────────────────────────┐  │
│  │ 2024-01-15: +50 (IN/00001)              │  │
│  │ 2024-01-14: -30 (OUT/00012)             │  │
│  │ [View All Moves]                        │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  [Adjust Quantity] [Transfer] [View BoM]       │
└─────────────────────────────────────────────────┘
```

**API:**
```typescript
// GET /api/inventory/products/[id]
interface ProductDetail extends Product {
  description: string
  description_sale: string
  standard_price: number
  list_price: number
  tracking: 'none' | 'lot' | 'serial'
  stock_quant_ids: StockQuant[]
  move_ids: StockMove[]
}

interface StockQuant {
  id: number
  location_id: [number, string]
  quantity: number
  reserved_quantity: number
  lot_id?: [number, string]
}
```

---

## Feature 2: Stock Locations

### 2.1 Location Tree View

**UI Layout:**
```
┌─────────────────────────────────────────────────┐
│ Locations                      [+ New Location] │
├─────────────────────────────────────────────────┤
│                                                 │
│  📍 Physical Locations                          │
│  ├─ 🏭 WH - Main Warehouse                      │
│  │  ├─ 📦 WH/Stock                              │
│  │  │  ├─ 📦 WH/Stock/Shelf A  (120 items)      │
│  │  │  ├─ 📦 WH/Stock/Shelf B  (85 items)       │
│  │  │  └─ 📦 WH/Stock/Shelf C  (45 items)       │
│  │  ├─ 📥 WH/Input                              │
│  │  └─ 📤 WH/Output                             │
│  │                                              │
│  ├─ 🏭 WH2 - Secondary Warehouse                │
│  │  └─ 📦 WH2/Stock  (200 items)                │
│                                                 │
│  📍 Virtual Locations                           │
│  ├─ 👥 Partners/Customers                       │
│  ├─ 🏪 Partners/Suppliers                       │
│  ├─ 🗑️ Virtual Locations/Scrap                  │
│  └─ 📊 Virtual Locations/Inventory adjustment   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**API:**
```typescript
// GET /api/inventory/locations
interface StockLocation {
  id: number
  name: string
  complete_name: string // "WH/Stock/Shelf A"
  location_id: [number, string] | false // Parent location
  child_ids: number[]
  usage: 'supplier' | 'view' | 'internal' | 'customer' | 'inventory' | 'production' | 'transit'
  barcode?: string
  quant_ids: number[] // Stock quants in this location
  total_quantity?: number // Computed: sum of quants
}
```

**Features:**
- ✅ Tree/hierarchy view
- ✅ Expand/collapse branches
- ✅ Filter by usage type
- ✅ Show total quantity per location
- ✅ Barcode per location for quick selection
- ✅ Create sub-locations
- ✅ Move products between locations

---

## Feature 3: Stock Transfers (Pickings)

### 3.1 Transfer List

**UI Layout:**
```
┌─────────────────────────────────────────────────┐
│ Transfers          [Draft] [Ready] [Done]       │
│                                  [+ New Transfer]│
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 📥 IN/00042 - Receipt from Supplier A     │ │
│  │ Date: 2024-01-20                          │ │
│  │ From: Vendors → WH/Input                  │ │
│  │ Status: [Ready]                           │ │
│  │ Products: 5 items                         │ │
│  │ [Process] [View Details]                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 📤 OUT/00123 - Delivery to Customer B    │ │
│  │ Date: 2024-01-21                          │ │
│  │ From: WH/Stock → Customers                │ │
│  │ Status: [Draft]                           │ │
│  │ Products: 3 items                         │ │
│  │ [Confirm] [View Details]                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Odoo Stock Picking States:**
```typescript
type PickingState =
  | 'draft'      // Draft
  | 'waiting'    // Waiting Another Operation
  | 'confirmed'  // Waiting
  | 'assigned'   // Ready
  | 'done'       // Done
  | 'cancel'     // Cancelled
```

**API:**
```typescript
// GET /api/inventory/pickings
interface StockPicking {
  id: number
  name: string // "IN/00042"
  picking_type_id: [number, string] // "Receipts", "Delivery Orders", "Internal Transfers"
  location_id: [number, string]
  location_dest_id: [number, string]
  partner_id?: [number, string]
  scheduled_date: string
  date_done?: string
  state: PickingState
  move_ids: number[] // Stock move IDs
  move_line_ids: number[] // Stock move line IDs
  origin?: string // Source document (e.g., "PO00042")
}

// POST /api/inventory/pickings
interface CreatePickingPayload {
  picking_type_id: number
  location_id: number
  location_dest_id: number
  scheduled_date: string
  move_ids_without_package: Array<{
    product_id: number
    product_uom_qty: number
    product_uom: number
    location_id: number
    location_dest_id: number
  }>
}
```

---

### 3.2 Process Transfer (Mobile-Optimized)

**UI Flow:**
```
Step 1: Select Transfer
┌─────────────────────────────────────┐
│ IN/00042 - Receipt                  │
│ From: Vendors → WH/Input            │
│ Products to receive: 5              │
│                                     │
│ [Start Processing] [Cancel]         │
└─────────────────────────────────────┘

Step 2: Scan/Enter Products
┌─────────────────────────────────────┐
│ Processing: IN/00042  [2/5 done]    │
├─────────────────────────────────────┤
│                                     │
│  [📷 Scan Barcode]                  │
│                                     │
│  ┌─ Product A ─────────────────┐   │
│  │ Expected: 100 Units         │   │
│  │ Received: [100] ✓           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─ Product B ─────────────────┐   │
│  │ Expected: 50 Units          │   │
│  │ Received: [50] ✓            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─ Product C ─────────────────┐   │
│  │ Expected: 200 Units         │   │
│  │ Received: [___]  ← Current  │   │
│  │ [+10] [+50] [+100]          │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Validate] [Save Draft]            │
└─────────────────────────────────────┘

Step 3: Confirmation
┌─────────────────────────────────────┐
│ ✅ Transfer Completed               │
│                                     │
│ IN/00042 processed successfully     │
│ 5 products received                 │
│                                     │
│ [Back to List] [Print Label]        │
└─────────────────────────────────────┘
```

**API:**
```typescript
// POST /api/inventory/pickings/[id]/validate
interface ValidatePickingPayload {
  move_line_ids: Array<{
    id: number
    qty_done: number
    lot_id?: number // If product is tracked by lot
    lot_name?: string // Create new lot
  }>
}

// PUT /api/inventory/pickings/[id]/button_validate
// Odoo method to finalize the picking
```

---

## Feature 4: Stock Adjustments (Inventory Count)

### 4.1 Inventory Adjustment

**Odoo 18 Note:** Inventory adjustments are now done by directly updating `stock.quant` records, không còn model `stock.inventory` như Odoo 13-16.

**UI Layout:**
```
┌─────────────────────────────────────────────────┐
│ Stock Adjustment                    [+ New Count]│
├─────────────────────────────────────────────────┤
│                                                 │
│  Location: [WH/Stock/Shelf A ▼]                │
│  Date: 2024-01-20                               │
│                                                 │
│  [📷 Scan Products]                             │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Product A (SKU: PROD-001)              │   │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │   │
│  │ System Qty:  100                       │   │
│  │ Counted Qty: [105]  (+5) ⚠️            │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Product B (SKU: PROD-002)              │   │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │   │
│  │ System Qty:  50                        │   │
│  │ Counted Qty: [48]  (-2) ⚠️             │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Summary:                                       │
│  • 2 products counted                           │
│  • Adjustments needed: +5, -2                   │
│                                                 │
│  [Apply Adjustments] [Cancel]                   │
└─────────────────────────────────────────────────┘
```

**API:**
```typescript
// GET /api/inventory/quants
interface StockQuantListParams {
  location_id: number
  product_id?: number
}

interface StockQuantResponse {
  id: number
  product_id: [number, string]
  location_id: [number, string]
  quantity: number // Current system quantity
  reserved_quantity: number
  lot_id?: [number, string]
}

// POST /api/inventory/adjustments
interface AdjustmentPayload {
  location_id: number
  adjustments: Array<{
    product_id: number
    location_id: number
    counted_quantity: number
    lot_id?: number
  }>
}

// This will call Odoo's stock.quant update or create stock.move for adjustments
```

---

## Feature 5: Barcode Scanning

### 5.1 Multi-Purpose Scanner

**Supported Formats:**
- EAN-13, EAN-8 (product barcodes)
- Code 128 (locations, lot numbers)
- QR codes (multi-data: product + qty + lot)

**Scanner Modes:**
1. **Product Search**: Scan to find product details
2. **Transfer Processing**: Scan during receive/delivery
3. **Inventory Count**: Scan to add to count list
4. **Location Selection**: Scan location barcode

**Implementation:**
```typescript
// components/inventory/BarcodeScanner.tsx
import { BrowserMultiFormatReader } from '@zxing/browser'

export function BarcodeScanner({ mode, onScan }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader()

    codeReader.decodeFromVideoDevice(
      undefined, // Use default camera
      videoRef.current!,
      (result, error) => {
        if (result) {
          setResult(result.getText())
          onScan(result.getText())
        }
      }
    )

    return () => {
      codeReader.reset()
    }
  }, [])

  return (
    <div className="relative">
      <video ref={videoRef} className="w-full aspect-video" />
      {result && (
        <div className="absolute bottom-4 left-4 right-4 bg-green-500 text-white p-4 rounded">
          Scanned: {result}
        </div>
      )}
    </div>
  )
}
```

---

## Feature 6: Reports & Analytics

### 6.1 Stock Valuation

**UI Layout:**
```
┌─────────────────────────────────────────────────┐
│ Stock Valuation                    [Export CSV] │
├─────────────────────────────────────────────────┤
│  Total Stock Value: $125,450                    │
│                                                 │
│  By Category:                                   │
│  • Raw Materials:    $80,000 (64%)              │
│  • Finished Goods:   $35,450 (28%)              │
│  • Consumables:      $10,000 (8%)               │
│                                                 │
│  By Location:                                   │
│  • WH/Stock:         $100,000                   │
│  • WH2/Stock:        $25,450                    │
│                                                 │
│  [View Detailed Report]                         │
└─────────────────────────────────────────────────┘
```

**API:**
```typescript
// GET /api/inventory/reports/valuation
interface StockValuationReport {
  total_value: number
  by_category: Array<{
    category: string
    value: number
    percentage: number
  }>
  by_location: Array<{
    location: string
    value: number
  }>
}
```

---

### 6.2 Stock Moves History

**UI: Filterable table with export**
- Date range filter
- Product filter
- Location filter
- Move type (in/out/internal)
- Export to Excel/CSV

---

## Feature 7: Lot/Serial Number Tracking

### 7.1 Lot Management

**For products with `tracking = 'lot'` or `'serial'`:**

```
┌─────────────────────────────────────────────────┐
│ Product A - Lot/Serial Numbers                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─ LOT-2024-001 ──────────────────────────┐   │
│  │ Qty: 100 Units                          │   │
│  │ Manufacturing Date: 2024-01-10          │   │
│  │ Expiration Date: 2025-01-10             │   │
│  │ Location: WH/Stock/Shelf A              │   │
│  │ [View History] [Transfer]               │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─ LOT-2024-002 ──────────────────────────┐   │
│  │ Qty: 50 Units                           │   │
│  │ ...                                     │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [+ Create New Lot]                             │
└─────────────────────────────────────────────────┘
```

**API:**
```typescript
// GET /api/inventory/lots
interface StockLot {
  id: number
  name: string // "LOT-2024-001"
  product_id: [number, string]
  product_qty: number
  create_date: string
  expiration_date?: string
  quant_ids: number[] // Where this lot is stored
}
```

---

## Implementation Priority

### Phase 1 (MVP):
1. ✅ Product list & detail
2. ✅ Location tree view
3. ✅ Stock transfers (basic)
4. ✅ Barcode scanner integration

### Phase 2:
5. ✅ Stock adjustments
6. ✅ Advanced filtering/search
7. ✅ Lot/serial tracking

### Phase 3:
8. ✅ Reports & analytics
9. ✅ Batch operations
10. ✅ Mobile optimizations

---

## Next: Manufacturing Module
See `04-manufacturing-features.md` for MRP module specifications.

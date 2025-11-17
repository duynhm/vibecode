# Manufacturing Module - Full Feature Specifications

## Odoo 18 MRP Models Mapping

### Core Models
```python
# Manufacturing models
mrp.production          # Manufacturing Orders (MO)
mrp.bom                 # Bill of Materials
mrp.bom.line            # BoM lines (components)
mrp.workcenter          # Work Centers (machines/stations)
mrp.workorder           # Work Orders (operations)
mrp.routing             # Routings (operation sequences)
mrp.routing.workcenter  # Routing operations
mrp.unbuild             # Unbuild Orders (disassembly)

# Related models
product.product         # Finished products & components
stock.move              # Material consumption & production
stock.picking           # Material transfers
quality.check           # Quality control points (if QC module installed)
```

---

## Feature 1: Manufacturing Orders (MO)

### 1.1 MO List View

**UI Layout:**
```
┌─────────────────────────────────────────────────┐
│ Manufacturing Orders   [Draft] [Planned] [Progress] [Done]
│                                 [+ New MO]      │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 🏭 MO/00042                               │ │
│  │ Product: Finished Product A               │ │
│  │ Qty to Produce: 100 Units                 │ │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │
│  │ Planned: 2024-01-20 10:00                 │ │
│  │ Status: [🔵 In Progress] 60%              │ │
│  │ Responsible: John Doe                     │ │
│  │ [View Details] [Record Production]        │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 🏭 MO/00043                               │ │
│  │ Product: Finished Product B               │ │
│  │ Qty to Produce: 50 Units                  │ │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │
│  │ Planned: 2024-01-21 08:00                 │ │
│  │ Status: [⚪ Draft]                        │ │
│  │ Responsible: Jane Smith                   │ │
│  │ [Confirm] [View Details]                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

**MO States:**
```typescript
type MrpProductionState =
  | 'draft'       // Draft
  | 'confirmed'   // Confirmed
  | 'planned'     // Planned (components reserved)
  | 'progress'    // In Progress
  | 'to_close'    // To Close
  | 'done'        // Done
  | 'cancel'      // Cancelled
```

**API:**
```typescript
// GET /api/manufacturing/productions
interface MrpProduction {
  id: number
  name: string // "MO/00042"
  product_id: [number, string]
  product_qty: number
  product_uom_id: [number, string]
  bom_id: [number, string]
  date_planned_start: string
  date_planned_finished?: string
  date_start?: string // Actual start
  date_finished?: string // Actual finish
  state: MrpProductionState
  user_id?: [number, string] // Responsible
  company_id: [number, string]
  location_src_id: [number, string] // Source location for components
  location_dest_id: [number, string] // Destination for finished product
  move_raw_ids: number[] // Component consumption moves
  move_finished_ids: number[] // Finished product moves
  workorder_ids: number[] // Work orders
  qty_produced: number // Already produced quantity
  reservation_state: 'confirmed' | 'assigned' | 'waiting'
}

// POST /api/manufacturing/productions
interface CreateProductionPayload {
  product_id: number
  product_qty: number
  bom_id?: number // Auto-select if not provided
  date_planned_start: string
  user_id?: number
}
```

---

### 1.2 MO Detail & Execution

**UI Layout:**
```
┌─────────────────────────────────────────────────┐
│ [← Back]  MO/00042              [⋮ Actions]     │
├─────────────────────────────────────────────────┤
│                                                 │
│  📦 Finished Product A                          │
│  Qty to Produce: 100 Units                      │
│  Progress: ████████░░ 60/100 (60%)              │
│                                                 │
│  ┌─── Status ─────────────────────────────┐    │
│  │ Current: 🔵 In Progress                │    │
│  │ Started: 2024-01-20 10:30              │    │
│  │ Expected Finish: 2024-01-20 16:00      │    │
│  │ Responsible: John Doe                  │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  ┌─── Bill of Materials (BoM) ───────────┐     │
│  │ BoM: BoM - Finished Product A          │     │
│  │                                        │     │
│  │ Components to Consume:                 │     │
│  │ ✓ Component A    50/50 Units  [Done]   │     │
│  │ ⏳ Component B    30/40 Units  [Partial]│     │
│  │ ○ Component C     0/20 Units  [Pending]│     │
│  │                                        │     │
│  │ [Record Consumption]                   │     │
│  └────────────────────────────────────────┘     │
│                                                 │
│  ┌─── Work Orders ────────────────────────┐    │
│  │ 1. ✅ Assembly (Done)                  │    │
│  │ 2. 🔵 Quality Check (In Progress)      │    │
│  │ 3. ○ Packaging (Pending)               │    │
│  │ [View Details]                         │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  ┌─── Production Progress ────────────────┐    │
│  │ Produced Qty: [____] Units             │    │
│  │ Scrap Qty: [0] Units                   │    │
│  │                                        │    │
│  │ [+10] [+25] [+50] [Complete All]       │    │
│  │                                        │    │
│  │ [📷 Scan Finished Product]             │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  [Record Production] [Mark as Done] [Cancel]    │
└─────────────────────────────────────────────────┘
```

**API:**
```typescript
// GET /api/manufacturing/productions/[id]
interface ProductionDetail extends MrpProduction {
  move_raw_ids_details: StockMove[] // Components with consumption details
  move_finished_ids_details: StockMove[]
  workorder_ids_details: MrpWorkorder[]
  availability: 'assigned' | 'partially_available' | 'waiting'
}

// POST /api/manufacturing/productions/[id]/record-production
interface RecordProductionPayload {
  qty_producing: number
  lot_id?: number // If product is tracked
  lot_name?: string // Create new lot
}

// POST /api/manufacturing/productions/[id]/button_mark_done
// Finalize the MO
```

---

## Feature 2: Bill of Materials (BoM)

### 2.1 BoM List View

**UI Layout:**
```
┌─────────────────────────────────────────────────┐
│ Bills of Materials           [Active] [Archived]│
│                                    [+ New BoM]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 📋 BoM - Finished Product A               │ │
│  │ Product: Finished Product A               │ │
│  │ Reference: BoM-001                        │ │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │
│  │ Quantity: 1.0 Unit                        │ │
│  │ Components: 5 items                       │ │
│  │ Operations: 3 steps                       │ │
│  │ [View Details] [Use in MO]                │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 📋 BoM - Product B (v2)                   │ │
│  │ ...                                       │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

**API:**
```typescript
// GET /api/manufacturing/boms
interface MrpBom {
  id: number
  code?: string // Reference
  product_tmpl_id: [number, string]
  product_id?: [number, string] // Specific variant or false
  product_qty: number
  product_uom_id: [number, string]
  type: 'normal' | 'phantom' // Phantom = kit (not stocked)
  bom_line_ids: number[]
  operation_ids: number[] // Routing operations
  active: boolean
  company_id: [number, string]
}

// GET /api/manufacturing/boms/[id]
interface BomDetail extends MrpBom {
  bom_line_ids_details: MrpBomLine[]
  operation_ids_details: MrpRoutingWorkcenter[]
}

interface MrpBomLine {
  id: number
  product_id: [number, string]
  product_qty: number
  product_uom_id: [number, string]
  sequence: number
  bom_id: number
}
```

---

### 2.2 BoM Detail View (Explosion View)

**UI Layout:**
```
┌─────────────────────────────────────────────────┐
│ [← Back] BoM - Finished Product A   [Edit]     │
├─────────────────────────────────────────────────┤
│                                                 │
│  📦 Finished Product A                          │
│  Quantity: 1.0 Unit                             │
│  Type: Manufacture this product                 │
│                                                 │
│  ┌─── Components ─────────────────────────┐    │
│  │                                        │    │
│  │ 1. Component A                         │    │
│  │    Qty: 50 Units                       │    │
│  │    Available: 150 ✓                    │    │
│  │                                        │    │
│  │ 2. Component B                         │    │
│  │    Qty: 40 Units                       │    │
│  │    Available: 30 ⚠️ (Shortage: -10)    │    │
│  │                                        │    │
│  │ 3. Component C                         │    │
│  │    Qty: 20 Units                       │    │
│  │    Available: 20 ✓                     │    │
│  │                                        │    │
│  │ [Check Availability]                   │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  ┌─── Operations (Routing) ───────────────┐    │
│  │                                        │    │
│  │ 1. Assembly                            │    │
│  │    Work Center: Assembly Line 1        │    │
│  │    Duration: 30 minutes                │    │
│  │                                        │    │
│  │ 2. Quality Check                       │    │
│  │    Work Center: QC Station             │    │
│  │    Duration: 15 minutes                │    │
│  │                                        │    │
│  │ 3. Packaging                           │    │
│  │    Work Center: Packaging Line         │    │
│  │    Duration: 10 minutes                │    │
│  │                                        │    │
│  │ Total Lead Time: 55 minutes            │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  ┌─── Structure & Cost ───────────────────┐    │
│  │ Component Cost: $45.50                 │    │
│  │ Operation Cost: $12.00                 │    │
│  │ Total Cost: $57.50 per unit            │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  [Create MO] [Structure Report]                 │
└─────────────────────────────────────────────────┘
```

---

## Feature 3: Work Orders

### 3.1 Work Order List (Tablet Kanban View)

**UI Layout:**
```
┌─────────────────────────────────────────────────┐
│ Work Orders                    [By Me] [All]    │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─── Pending ────┬─── In Progress ─┬─ Done ─┐ │
│  │                │                  │        │ │
│  │ ┌────────────┐ │ ┌──────────────┐│        │ │
│  │ │ WO/00012   │ │ │ WO/00010     ││ ✅ 5   │ │
│  │ │ Assembly   │ │ │ QC Check     ││ today  │ │
│  │ │ MO/00042   │ │ │ MO/00041     ││        │ │
│  │ │ 100 Units  │ │ │ ⏱️ 00:45:20  ││        │ │
│  │ │ [Start]    │ │ │ [Pause][Done]││        │ │
│  │ └────────────┘ │ └──────────────┘│        │ │
│  │                │                  │        │ │
│  │ ┌────────────┐ │                  │        │ │
│  │ │ WO/00013   │ │                  │        │ │
│  │ │ Packaging  │ │                  │        │ │
│  │ │ ...        │ │                  │        │ │
│  │ └────────────┘ │                  │        │ │
│  │                │                  │        │ │
│  └────────────────┴──────────────────┴────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

**API:**
```typescript
// GET /api/manufacturing/workorders
interface MrpWorkorder {
  id: number
  name: string // "WO/00012"
  production_id: [number, string] // Parent MO
  workcenter_id: [number, string]
  operation_id: [number, string] // From routing
  state: 'pending' | 'ready' | 'progress' | 'done' | 'cancel'
  date_planned_start: string
  date_planned_finished: string
  date_start?: string
  date_finished?: string
  duration_expected: number // minutes
  duration: number // actual duration
  qty_production: number
  qty_produced: number
  user_id?: [number, string] // Assigned worker
}

// POST /api/manufacturing/workorders/[id]/button_start
// Start work order (records time)

// POST /api/manufacturing/workorders/[id]/button_finish
// Complete work order
```

---

### 3.2 Work Order Execution (Mobile Interface)

**UI Flow:**
```
Step 1: Select Work Order
┌─────────────────────────────────────┐
│ WO/00012 - Assembly                 │
│ MO/00042: Finished Product A        │
│ Qty to Produce: 100 Units           │
│ Work Center: Assembly Line 1        │
│ Expected Duration: 30 min           │
│                                     │
│ [Start Work Order]                  │
└─────────────────────────────────────┘

Step 2: Active Work Order
┌─────────────────────────────────────┐
│ ⏱️ WO/00012 - IN PROGRESS           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Time Elapsed: 00:15:42              │
│ Expected: 00:30:00                  │
│ Progress: 50%                       │
│                                     │
│ ┌─ Instructions ────────────────┐  │
│ │ 1. Assemble base unit         │  │
│ │ 2. Attach component A         │  │
│ │ 3. Secure with bolts          │  │
│ │ 4. Perform visual check       │  │
│ └───────────────────────────────┘  │
│                                     │
│ ┌─ Components Consumed ─────────┐  │
│ │ Component A: 50 Units ✓       │  │
│ │ Component B: 40 Units ✓       │  │
│ │ [Record Consumption]          │  │
│ └───────────────────────────────┘  │
│                                     │
│ ┌─ Production ──────────────────┐  │
│ │ Produced: [50] / 100 Units    │  │
│ │ [+1] [+10] [+25] [Complete]   │  │
│ └───────────────────────────────┘  │
│                                     │
│ [⏸️ Pause] [✅ Mark Done] [❌ Cancel]│
└─────────────────────────────────────┘

Step 3: Quality Checks (if configured)
┌─────────────────────────────────────┐
│ Quality Control Points              │
│                                     │
│ ✓ Dimension Check - PASSED          │
│ ✓ Weight Check - PASSED             │
│ ○ Visual Inspection - Pending       │
│                                     │
│ [Complete Inspection]               │
└─────────────────────────────────────┘
```

---

## Feature 4: Work Centers

### 4.1 Work Center Dashboard

**UI Layout:**
```
┌─────────────────────────────────────────────────┐
│ Work Centers                 [+ New Work Center]│
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 🏭 Assembly Line 1                        │ │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │
│  │ Status: 🟢 Active                         │ │
│  │ Capacity: 8 hours/day                     │ │
│  │ Efficiency: 95%                           │ │
│  │                                           │ │
│  │ Current WO: WO/00010 (In Progress)        │ │
│  │ Next: WO/00012 (Scheduled 14:00)          │ │
│  │                                           │ │
│  │ [View Schedule] [Performance]             │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 🏭 QC Station                             │ │
│  │ Status: 🔴 Maintenance                    │ │
│  │ ...                                       │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

**API:**
```typescript
// GET /api/manufacturing/workcenters
interface MrpWorkcenter {
  id: number
  name: string
  code?: string
  active: boolean
  resource_id: number // Resource calendar
  time_efficiency: number // 0-100%
  oee_target: number // Overall Equipment Effectiveness target
  capacity: number // Hours per day
  time_ids: number[] // Working time calendar
  alternative_workcenter_ids: number[] // Backup workcenters
}
```

---

## Feature 5: Production Planning

### 5.1 Production Schedule (Gantt-like View)

**UI Layout (Simplified for Mobile):**
```
┌─────────────────────────────────────────────────┐
│ Production Schedule           [Today] [Week]    │
├─────────────────────────────────────────────────┤
│                                                 │
│  📅 Today - January 20, 2024                    │
│                                                 │
│  ┌─ Assembly Line 1 ────────────────────────┐  │
│  │ 08:00 ███████████░░░░░░░░░░░░░ 14:00      │  │
│  │       WO/00010 (MO/00041)                 │  │
│  │                                           │  │
│  │ 14:00 ░░░░░░░░███████████░░░ 18:00        │  │
│  │            WO/00012 (MO/00042)            │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─ QC Station ──────────────────────────────┐  │
│  │ 10:00 ████████░░░░░░░░░░░░░░ 12:00        │  │
│  │       WO/00011 (MO/00041)                 │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  [← Previous Day] [Next Day →]                  │
└─────────────────────────────────────────────────┘
```

---

## Feature 6: Scrap & Unbuild

### 6.1 Scrap Management

**UI:**
```
┌─────────────────────────────────────────────────┐
│ Record Scrap                                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  Production Order: [MO/00042 ▼]                 │
│  Product: Finished Product A                    │
│                                                 │
│  Scrap Qty: [____] Units                        │
│  Scrap Location: [WH/Scrap ▼]                   │
│                                                 │
│  Reason:                                        │
│  ○ Defective                                    │
│  ○ Damaged during production                    │
│  ○ Quality check failed                         │
│  ○ Other: [_____________]                       │
│                                                 │
│  Notes:                                         │
│  [________________________________]              │
│                                                 │
│  [Confirm Scrap] [Cancel]                       │
└─────────────────────────────────────────────────┘
```

**API:**
```typescript
// POST /api/manufacturing/scrap
interface ScrapPayload {
  production_id: number
  product_id: number
  scrap_qty: number
  location_id: number // Scrap location
  scrap_reason?: string
}
```

---

### 6.2 Unbuild Orders (Disassembly)

**For returning finished products to components:**

```
┌─────────────────────────────────────────────────┐
│ Unbuild Order                                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Product to Unbuild: [Finished Product A ▼]     │
│  Quantity: [____] Units                         │
│  BoM: [BoM - Finished Product A ▼]              │
│                                                 │
│  Location: [WH/Stock ▼]                         │
│                                                 │
│  Components to Receive:                         │
│  • Component A: 50 Units                        │
│  • Component B: 40 Units                        │
│  • Component C: 20 Units                        │
│                                                 │
│  Reason: [Quality issue / Return / Other]       │
│                                                 │
│  [Create Unbuild Order] [Cancel]                │
└─────────────────────────────────────────────────┘
```

**API:**
```typescript
// POST /api/manufacturing/unbuild
interface UnbuildPayload {
  product_id: number
  product_qty: number
  bom_id: number
  location_id: number
  location_dest_id: number
}
```

---

## Feature 7: Reports & Analytics

### 7.1 Production Analysis

```
┌─────────────────────────────────────────────────┐
│ Production Analysis               [Export]      │
├─────────────────────────────────────────────────┤
│  Period: [Last 7 Days ▼]                        │
│                                                 │
│  ┌─ Summary ────────────────────────────────┐  │
│  │ MOs Created: 24                          │  │
│  │ MOs Completed: 18                        │  │
│  │ Units Produced: 1,250                    │  │
│  │ Avg Completion Time: 3.5 hours           │  │
│  │ On-Time Delivery: 85%                    │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌─ By Product ─────────────────────────────┐  │
│  │ • Product A: 600 units (48%)             │  │
│  │ • Product B: 400 units (32%)             │  │
│  │ • Product C: 250 units (20%)             │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌─ Efficiency ─────────────────────────────┐  │
│  │ Work Center Utilization:                 │  │
│  │ • Assembly Line 1: 92%                   │  │
│  │ • QC Station: 78%                        │  │
│  │ • Packaging Line: 65%                    │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### 7.2 WIP (Work in Progress) Report

```
┌─────────────────────────────────────────────────┐
│ Work in Progress                                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Total WIP Value: $45,230                       │
│                                                 │
│  ┌─ By MO ──────────────────────────────────┐  │
│  │ MO/00042 - Product A                     │  │
│  │ Progress: 60% | Value: $8,500            │  │
│  │                                          │  │
│  │ MO/00043 - Product B                     │  │
│  │ Progress: 30% | Value: $5,200            │  │
│  │ ...                                      │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌─ Components Consumed (Not Finished) ─────┐  │
│  │ Component A: $12,000                     │  │
│  │ Component B: $8,500                      │  │
│  │ ...                                      │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Feature 8: Mobile Notifications

### 8.1 Real-time Alerts

**Push notifications cho:**
- ✅ MO assigned to worker
- ✅ WO ready to start
- ✅ Component shortage detected
- ✅ Quality check required
- ✅ Production milestone reached
- ✅ Maintenance scheduled

**Implementation:**
```typescript
// Use Web Push API + Service Worker
// Or integrate with Firebase Cloud Messaging
```

---

## Implementation Priority

### Phase 1 (MVP):
1. ✅ MO list & detail view
2. ✅ BoM view (read-only)
3. ✅ Work order list & execution
4. ✅ Record production progress
5. ✅ Component consumption tracking

### Phase 2:
6. ✅ Work center dashboard
7. ✅ Production scheduling
8. ✅ Scrap management
9. ✅ Quality check integration

### Phase 3:
10. ✅ Unbuild orders
11. ✅ Advanced reports & analytics
12. ✅ Push notifications
13. ✅ Offline mode for work orders

---

## Integration Points with Inventory Module

### Cross-module Features:
- **Component Availability**: Check stock before starting MO
- **Auto-reserve Components**: When MO is confirmed
- **Finished Product Receipt**: Auto-create stock move to destination
- **Barcode Scanning**: Unified scanner for both modules
- **Location Management**: Shared location tree

---

## Next: Development Setup
See `05-development-setup.md` for project initialization guide.

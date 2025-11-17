// User & Auth types
export interface User {
  id: number
  name: string
  email: string
  username: string
  role: 'admin' | 'manager' | 'worker'
  avatar?: string
  department?: string
  permissions: {
    inventory: {
      view: boolean
      manage: boolean
      admin: boolean
    }
    manufacturing: {
      view: boolean
      manage: boolean
      admin: boolean
    }
  }
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: string
}

// Inventory types
export type ProductTracking = 'none' | 'lot' | 'serial'

export interface Product {
  id: number
  name: string
  default_code: string // SKU
  barcode?: string
  type: 'product' | 'consu' | 'service'
  categ_id: [number, string]
  uom_id: [number, string]
  qty_available: number
  virtual_available: number
  incoming_qty: number
  outgoing_qty: number
  image_128?: string
  tracking?: ProductTracking // NEW: Odoo 18 tracking
}

export interface StockLocation {
  id: number
  name: string
  complete_name: string
  location_id: [number, string] | false
  child_ids: number[]
  usage: 'supplier' | 'view' | 'internal' | 'customer' | 'inventory' | 'production' | 'transit'
  barcode?: string
  total_quantity?: number
}

export interface StockQuant {
  id: number
  product_id: [number, string]
  location_id: [number, string]
  quantity: number
  reserved_quantity: number
  lot_id?: [number, string]
}

export type PickingState = 'draft' | 'waiting' | 'confirmed' | 'assigned' | 'done' | 'cancel'

export interface StockPicking {
  id: number
  name: string
  picking_type_id: [number, string]
  location_id: [number, string]
  location_dest_id: [number, string]
  partner_id?: [number, string]
  scheduled_date: string
  date_done?: string
  state: PickingState
  move_ids: number[]
  origin?: string
  products_count?: number
  next_transfer_id?: number // NEW: For multi-step routes
  backorder_id?: number // NEW: For backorders
}

export type MoveState = 'draft' | 'waiting' | 'confirmed' | 'assigned' | 'done' | 'cancel'

export interface StockMove {
  id: number
  name: string
  product_id: [number, string]
  product_uom_qty: number
  quantity_done: number
  product_uom: [number, string]
  location_id: [number, string]
  location_dest_id: [number, string]
  state: MoveState
  picking_id: number
}

// Lot/Serial Number types
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

// Batch & Wave Picking types
export type BatchWaveState = 'draft' | 'in_progress' | 'done' | 'cancel'
export type BatchGroupCriteria = 'contact' | 'carrier' | 'location' | 'destination' | 'country'
export type WaveGroupCriteria = 'product' | 'category' | 'location'

export interface BatchTransfer {
  id: number
  name: string
  picking_ids: number[]
  user_id: [number, string]
  state: BatchWaveState
  batch_type: 'automatic' | 'manual'
  grouped_by: BatchGroupCriteria
  scheduled_date: string
  pickings_count: number
  total_qty: number
}

export interface WaveTransfer {
  id: number
  name: string
  picking_ids: number[]
  user_id: [number, string]
  state: BatchWaveState
  wave_type: 'automatic' | 'manual'
  grouped_by: WaveGroupCriteria
  scheduled_date: string
  pickings_count: number
  total_qty: number
}

// Manufacturing types
export type MrpProductionState = 'draft' | 'confirmed' | 'planned' | 'progress' | 'to_close' | 'done' | 'cancel'

export interface MrpProduction {
  id: number
  name: string
  product_id: [number, string]
  product_qty: number
  product_uom_id: [number, string]
  bom_id: [number, string]
  date_planned_start: string
  date_planned_finished?: string
  date_start?: string
  date_finished?: string
  state: MrpProductionState
  user_id?: [number, string]
  qty_produced: number
  workorder_ids: number[]
  progress?: number
}

export type WorkorderState = 'pending' | 'ready' | 'progress' | 'done' | 'cancel'

export interface MrpWorkorder {
  id: number
  name: string
  production_id: [number, string]
  workcenter_id: [number, string]
  state: WorkorderState
  date_planned_start: string
  date_planned_finished: string
  date_start?: string
  date_finished?: string
  duration_expected: number
  duration: number
  qty_production: number
  qty_produced: number
}

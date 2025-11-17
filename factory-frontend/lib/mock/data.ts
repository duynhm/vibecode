import { Product, StockLocation, StockPicking, StockQuant, StockMove, LotSerial, MrpProduction, MrpWorkorder } from '@/types'
import productsData from '@/data/products.json'
import locationsData from '@/data/locations.json'
import pickingsData from '@/data/pickings.json'
import stockQuantsData from '@/data/stock-quants.json'
import stockMovesData from '@/data/stock-moves.json'
import lotSerialsData from '@/data/lot-serials.json'
import productionsData from '@/data/productions.json'
import workordersData from '@/data/workorders.json'

/**
 * Mock Data Service - simulates API calls with local JSON data
 */
export class MockDataService {
  /**
   * Simulate API delay
   */
  private static async delay(ms: number = 300): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  // ===== INVENTORY =====

  /**
   * Get all products
   */
  static async getProducts(): Promise<Product[]> {
    await this.delay()
    return productsData as Product[]
  }

  /**
   * Get product by ID
   */
  static async getProduct(id: number): Promise<Product | null> {
    await this.delay()
    const product = productsData.find((p) => p.id === id)
    return product ? (product as Product) : null
  }

  /**
   * Search products by query
   */
  static async searchProducts(query: string): Promise<Product[]> {
    await this.delay()
    const lowercaseQuery = query.toLowerCase()
    return productsData.filter(
      (p) =>
        p.name.toLowerCase().includes(lowercaseQuery) ||
        p.default_code.toLowerCase().includes(lowercaseQuery) ||
        p.barcode?.toLowerCase().includes(lowercaseQuery)
    ) as Product[]
  }

  /**
   * Get all stock locations
   */
  static async getLocations(): Promise<StockLocation[]> {
    await this.delay()
    return locationsData as StockLocation[]
  }

  /**
   * Get location by ID
   */
  static async getLocation(id: number): Promise<StockLocation | null> {
    await this.delay()
    const location = locationsData.find((l) => l.id === id)
    return location ? (location as StockLocation) : null
  }

  /**
   * Get all stock pickings
   */
  static async getPickings(): Promise<StockPicking[]> {
    await this.delay()
    return pickingsData as StockPicking[]
  }

  /**
   * Get picking by ID
   */
  static async getPicking(id: number): Promise<StockPicking | null> {
    await this.delay()
    const picking = pickingsData.find((p) => p.id === id)
    return picking ? (picking as StockPicking) : null
  }

  /**
   * Get pickings by state
   */
  static async getPickingsByState(state: string): Promise<StockPicking[]> {
    await this.delay()
    return pickingsData.filter((p) => p.state === state) as StockPicking[]
  }

  /**
   * Get all stock moves
   */
  static async getStockMoves(): Promise<StockMove[]> {
    await this.delay()
    return stockMovesData as StockMove[]
  }

  /**
   * Get stock moves by picking ID
   */
  static async getStockMovesByPicking(pickingId: number): Promise<StockMove[]> {
    await this.delay()
    return stockMovesData.filter((m) => m.picking_id === pickingId) as StockMove[]
  }

  /**
   * Get stock move by ID
   */
  static async getStockMove(id: number): Promise<StockMove | null> {
    await this.delay()
    const move = stockMovesData.find((m) => m.id === id)
    return move ? (move as StockMove) : null
  }

  // ===== MANUFACTURING =====

  /**
   * Get all manufacturing orders
   */
  static async getProductions(): Promise<MrpProduction[]> {
    await this.delay()
    return productionsData as MrpProduction[]
  }

  /**
   * Get production by ID
   */
  static async getProduction(id: number): Promise<MrpProduction | null> {
    await this.delay()
    const production = productionsData.find((p) => p.id === id)
    return production ? (production as MrpProduction) : null
  }

  /**
   * Get productions by state
   */
  static async getProductionsByState(state: string): Promise<MrpProduction[]> {
    await this.delay()
    return productionsData.filter((p) => p.state === state) as MrpProduction[]
  }

  /**
   * Get all work orders
   */
  static async getWorkorders(): Promise<MrpWorkorder[]> {
    await this.delay()
    return workordersData as MrpWorkorder[]
  }

  /**
   * Get work order by ID
   */
  static async getWorkorder(id: number): Promise<MrpWorkorder | null> {
    await this.delay()
    const workorder = workordersData.find((w) => w.id === id)
    return workorder ? (workorder as MrpWorkorder) : null
  }

  /**
   * Get work orders by production ID
   */
  static async getWorkordersByProduction(productionId: number): Promise<MrpWorkorder[]> {
    await this.delay()
    return workordersData.filter((w) => w.production_id[0] === productionId) as MrpWorkorder[]
  }

  /**
   * Get work orders by state
   */
  static async getWorkordersByState(state: string): Promise<MrpWorkorder[]> {
    await this.delay()
    return workordersData.filter((w) => w.state === state) as MrpWorkorder[]
  }

  // ===== STOCK QUANTS =====

  /**
   * Get all stock quants
   */
  static async getStockQuants(): Promise<StockQuant[]> {
    await this.delay()
    return stockQuantsData as StockQuant[]
  }

  /**
   * Get stock quants by product ID
   */
  static async getStockQuantsByProduct(productId: number): Promise<StockQuant[]> {
    await this.delay()
    return stockQuantsData.filter((q) => q.product_id[0] === productId) as StockQuant[]
  }

  /**
   * Get stock quants by location ID
   */
  static async getStockQuantsByLocation(locationId: number): Promise<StockQuant[]> {
    await this.delay()
    return stockQuantsData.filter((q) => q.location_id[0] === locationId) as StockQuant[]
  }

  // ===== LOT/SERIAL NUMBERS =====

  /**
   * Get all lot/serial numbers
   */
  static async getLotSerials(): Promise<LotSerial[]> {
    await this.delay()
    return lotSerialsData as LotSerial[]
  }

  /**
   * Get lot/serial by ID
   */
  static async getLotSerial(id: number): Promise<LotSerial | null> {
    await this.delay()
    const lot = lotSerialsData.find((l) => l.id === id)
    return lot ? (lot as LotSerial) : null
  }

  /**
   * Get lot/serials by product ID
   */
  static async getLotSerialsByProduct(productId: number): Promise<LotSerial[]> {
    await this.delay()
    return lotSerialsData.filter((l) => l.product_id[0] === productId) as LotSerial[]
  }

  /**
   * Get lot/serials expiring soon (within days)
   */
  static async getExpiringSoonLotSerials(days: number = 60): Promise<LotSerial[]> {
    await this.delay()
    const now = new Date()
    const threshold = new Date()
    threshold.setDate(threshold.getDate() + days)

    return lotSerialsData.filter((l) => {
      if (!l.expiration_date) return false
      const expiryDate = new Date(l.expiration_date)
      return expiryDate >= now && expiryDate <= threshold
    }) as LotSerial[]
  }

  /**
   * Get expired lot/serials
   */
  static async getExpiredLotSerials(): Promise<LotSerial[]> {
    await this.delay()
    const now = new Date()
    return lotSerialsData.filter((l) => {
      if (!l.expiration_date) return false
      return new Date(l.expiration_date) < now
    }) as LotSerial[]
  }
}

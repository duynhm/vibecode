import { Product, StockLocation, StockPicking, MrpProduction, MrpWorkorder } from '@/types'
import productsData from '@/data/products.json'
import locationsData from '@/data/locations.json'
import pickingsData from '@/data/pickings.json'
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
}

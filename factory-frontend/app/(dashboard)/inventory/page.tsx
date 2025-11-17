'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Package, TrendingUp, TrendingDown } from 'lucide-react'
import { MockDataService } from '@/lib/mock/data'
import { Product } from '@/types'
import { formatNumber } from '@/lib/utils'

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await MockDataService.getProducts()
        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products)
    } else {
      const lowercaseQuery = searchQuery.toLowerCase()
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowercaseQuery) ||
          p.default_code.toLowerCase().includes(lowercaseQuery) ||
          p.barcode?.toLowerCase().includes(lowercaseQuery)
      )
      setFilteredProducts(filtered)
    }
  }, [searchQuery, products])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Quản lý Kho</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Kho</h1>
        <p className="text-muted-foreground mt-2">
          Danh sách sản phẩm và tồn kho
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên, SKU, hoặc barcode..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Hiển thị {filteredProducts.length} / {products.length} sản phẩm
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="mt-1">
                    SKU: {product.default_code}
                  </CardDescription>
                  {product.barcode && (
                    <CardDescription className="text-xs mt-0.5">
                      Barcode: {product.barcode}
                    </CardDescription>
                  )}
                </div>
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Category */}
              <div>
                <Badge variant="secondary">{product.categ_id[1]}</Badge>
              </div>

              {/* Stock Info */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Có sẵn:</span>
                  <span className="text-2xl font-bold">
                    {formatNumber(product.qty_available)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Dự kiến:</span>
                  <span className={product.virtual_available >= product.qty_available ? 'text-green-600' : 'text-orange-600'}>
                    {formatNumber(product.virtual_available)}
                  </span>
                </div>
              </div>

              {/* In/Out */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-muted-foreground">Nhập:</span>
                  <span className="text-sm font-medium">{formatNumber(product.incoming_qty)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-4 w-4 text-orange-600" />
                  <span className="text-xs text-muted-foreground">Xuất:</span>
                  <span className="text-sm font-medium">{formatNumber(product.outgoing_qty)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2">
                <Link href={`/inventory/${product.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Xem chi tiết
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Không tìm thấy sản phẩm nào
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

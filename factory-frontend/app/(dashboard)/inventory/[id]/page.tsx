'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Package, TrendingUp, TrendingDown, MapPin } from 'lucide-react'
import { MockDataService } from '@/lib/mock/data'
import { Product, StockQuant } from '@/types'
import { formatNumber } from '@/lib/utils'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = parseInt(params.id as string)

  const [product, setProduct] = useState<Product | null>(null)
  const [stockQuants, setStockQuants] = useState<StockQuant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProductDetail() {
      try {
        const [productData, quantsData] = await Promise.all([
          MockDataService.getProduct(productId),
          MockDataService.getStockQuantsByProduct(productId),
        ])

        setProduct(productData)
        setStockQuants(quantsData)
      } catch (error) {
        console.error('Failed to load product detail:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProductDetail()
  }, [productId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Không tìm thấy sản phẩm</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const reservedQty = stockQuants.reduce((sum, q) => sum + q.reserved_quantity, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-1">
              SKU: {product.default_code}
              {product.barcode && ` • Barcode: ${product.barcode}`}
            </p>
          </div>
        </div>

        <Badge variant="secondary" className="text-base px-4 py-2">
          {product.categ_id[1]}
        </Badge>
      </div>

      {/* Stock Information */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Có sẵn</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(product.qty_available)}</div>
            <p className="text-xs text-muted-foreground mt-1">{product.uom_id[1]}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã đặt trước</CardTitle>
            <Package className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(reservedQty)}</div>
            <p className="text-xs text-muted-foreground mt-1">{product.uom_id[1]}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dự kiến</CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(product.virtual_available)}</div>
            <p className="text-xs text-muted-foreground mt-1">{product.uom_id[1]}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhập/Xuất</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-600">
                +{formatNumber(product.incoming_qty)}
              </span>
              <span className="text-muted-foreground">/</span>
              <span className="text-2xl font-bold text-orange-600">
                -{formatNumber(product.outgoing_qty)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{product.uom_id[1]}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stock by Location */}
        <Card>
          <CardHeader>
            <CardTitle>Tồn kho theo vị trí</CardTitle>
            <CardDescription>
              Phân bổ tồn kho tại các kho/kệ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stockQuants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Không có tồn kho tại bất kỳ vị trí nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stockQuants.map((quant) => (
                  <div key={quant.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{quant.location_id[1]}</p>
                        {quant.reserved_quantity > 0 && (
                          <p className="text-sm text-orange-600">
                            Đặt trước: {formatNumber(quant.reserved_quantity)} {product.uom_id[1]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{formatNumber(quant.quantity)}</p>
                      <p className="text-xs text-muted-foreground">{product.uom_id[1]}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin sản phẩm</CardTitle>
            <CardDescription>
              Chi tiết về sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Mã sản phẩm (SKU)</p>
                <p className="font-medium">{product.default_code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Barcode</p>
                <p className="font-medium">{product.barcode || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Loại</p>
                <Badge variant="outline">
                  {product.type === 'product' ? 'Sản phẩm lưu kho' :
                   product.type === 'consu' ? 'Vật tư tiêu hao' : 'Dịch vụ'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đơn vị tính</p>
                <p className="font-medium">{product.uom_id[1]}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-2">Danh mục</p>
              <Badge variant="secondary" className="text-base">
                {product.categ_id[1]}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button size="lg">
          <TrendingUp className="mr-2 h-5 w-5" />
          Điều chỉnh tồn kho
        </Button>
        <Button variant="outline" size="lg">
          <TrendingDown className="mr-2 h-5 w-5" />
          Chuyển kho
        </Button>
        <Button variant="outline" size="lg">
          Xem lịch sử di chuyển
        </Button>
      </div>
    </div>
  )
}

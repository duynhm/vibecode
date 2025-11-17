'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Package,
  TrendingUp,
  TrendingDown,
  MapPin,
  Tags,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { MockDataService } from '@/lib/mock/data'
import { Product, StockQuant, LotSerial } from '@/types'
import { formatNumber } from '@/lib/utils'
import { format, differenceInDays } from 'date-fns'

const getExpiryStatus = (expirationDate?: string) => {
  if (!expirationDate) return 'no-expiry'

  const now = new Date()
  const expiry = new Date(expirationDate)
  const daysUntilExpiry = differenceInDays(expiry, now)

  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 30) return 'expiring-soon'
  if (daysUntilExpiry <= 60) return 'expiring-warning'
  return 'ok'
}

const getExpiryBadge = (expirationDate?: string) => {
  const status = getExpiryStatus(expirationDate)

  switch (status) {
    case 'expired':
      return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="mr-1 h-3 w-3" />Hết hạn</Badge>
    case 'expiring-soon':
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200"><AlertTriangle className="mr-1 h-3 w-3" />Sắp hết</Badge>
    case 'expiring-warning':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><AlertTriangle className="mr-1 h-3 w-3" />Cảnh báo</Badge>
    case 'ok':
      return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle2 className="mr-1 h-3 w-3" />Còn hạn</Badge>
    default:
      return null
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = parseInt(params.id as string)

  const [product, setProduct] = useState<Product | null>(null)
  const [stockQuants, setStockQuants] = useState<StockQuant[]>([])
  const [lots, setLots] = useState<LotSerial[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProductDetail() {
      try {
        const [productData, quantsData, lotsData] = await Promise.all([
          MockDataService.getProduct(productId),
          MockDataService.getStockQuantsByProduct(productId),
          MockDataService.getLotSerialsByProduct(productId),
        ])

        setProduct(productData)
        setStockQuants(quantsData)
        setLots(lotsData.sort((a, b) => {
          if (!a.expiration_date) return 1
          if (!b.expiration_date) return -1
          return new Date(a.expiration_date).getTime() - new Date(b.expiration_date).getTime()
        }))
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
  const hasTracking = product.tracking && product.tracking !== 'none'
  const expiredLots = lots.filter((l) => getExpiryStatus(l.expiration_date) === 'expired')
  const expiringLots = lots.filter((l) => {
    const status = getExpiryStatus(l.expiration_date)
    return status === 'expiring-soon' || status === 'expiring-warning'
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              {hasTracking && (
                <Badge variant="outline" className="text-base px-3 py-1">
                  <Tags className="mr-1 h-4 w-4" />
                  {product.tracking === 'serial' ? 'Serial' : 'Lot'} Tracking
                </Badge>
              )}
            </div>
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

      {/* Lot/Serial Alerts */}
      {hasTracking && (expiredLots.length > 0 || expiringLots.length > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-600 mt-1" />
              <div className="flex-1">
                <p className="font-semibold text-orange-900">Cảnh báo Lot/Serial</p>
                {expiredLots.length > 0 && (
                  <p className="text-sm text-orange-700 mt-1">
                    {expiredLots.length} lot/serial đã hết hạn
                  </p>
                )}
                {expiringLots.length > 0 && (
                  <p className="text-sm text-orange-700 mt-1">
                    {expiringLots.length} lot/serial sắp hết hạn trong 60 ngày tới
                  </p>
                )}
              </div>
              <Link href="/lots">
                <Button variant="outline" size="sm">
                  Xem danh sách Lot
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Stock by Location and Lot/Serial Tracking */}
      {hasTracking ? (
        <Tabs defaultValue="location" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="location">Tồn kho theo vị trí</TabsTrigger>
            <TabsTrigger value="lots">
              Lot/Serial Tracking ({lots.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location" className="mt-6">
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
                    <div>
                      <p className="text-sm text-muted-foreground">Theo dõi</p>
                      <Badge variant={hasTracking ? 'default' : 'secondary'}>
                        {product.tracking === 'serial' ? 'Serial Number' :
                         product.tracking === 'lot' ? 'Lot Number' : 'Không theo dõi'}
                      </Badge>
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
          </TabsContent>

          <TabsContent value="lots" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách Lot/Serial</CardTitle>
                <CardDescription>
                  Tất cả lot/serial của sản phẩm này
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lots.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Tags className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Chưa có lot/serial nào</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lots.map((lot) => {
                      const daysUntilExpiry = lot.expiration_date
                        ? differenceInDays(new Date(lot.expiration_date), new Date())
                        : null
                      const status = getExpiryStatus(lot.expiration_date)

                      return (
                        <div
                          key={lot.id}
                          className={`p-4 rounded-lg border-2 ${
                            status === 'expired' ? 'border-red-200 bg-red-50' :
                            status === 'expiring-soon' ? 'border-orange-200 bg-orange-50' :
                            status === 'expiring-warning' ? 'border-yellow-200 bg-yellow-50' :
                            'border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/lots/${lot.id}`}
                                  className="font-semibold text-blue-600 hover:underline"
                                >
                                  {lot.name}
                                </Link>
                                {getExpiryBadge(lot.expiration_date)}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold">{formatNumber(lot.product_qty)}</p>
                              <p className="text-xs text-muted-foreground">{product.uom_id[1]}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Ngày tạo:</p>
                              <p className="font-medium flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(lot.create_date), 'dd/MM/yyyy')}
                              </p>
                            </div>
                            {lot.expiration_date && (
                              <div>
                                <p className="text-xs text-muted-foreground">Hạn sử dụng:</p>
                                <p className={`font-medium flex items-center gap-1 ${
                                  status === 'expired' ? 'text-red-600' :
                                  status === 'expiring-soon' ? 'text-orange-600' :
                                  status === 'expiring-warning' ? 'text-yellow-600' :
                                  'text-green-600'
                                }`}>
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(lot.expiration_date), 'dd/MM/yyyy')}
                                  {daysUntilExpiry !== null && (
                                    <span className="text-xs">
                                      ({daysUntilExpiry > 0 ? `${daysUntilExpiry}d` : `-${Math.abs(daysUntilExpiry)}d`})
                                    </span>
                                  )}
                                </p>
                              </div>
                            )}
                          </div>

                          {lot.note && (
                            <div className="mt-2 pt-2 border-t text-sm text-muted-foreground italic">
                              {lot.note}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
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
      )}

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
        {hasTracking && (
          <Link href="/lots">
            <Button variant="outline" size="lg">
              <Tags className="mr-2 h-5 w-5" />
              Quản lý Lot/Serial
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

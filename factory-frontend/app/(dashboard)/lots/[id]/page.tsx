'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Package,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MapPin,
  FileText
} from 'lucide-react'
import { MockDataService } from '@/lib/mock/data'
import { LotSerial, StockQuant } from '@/types'
import { format, differenceInDays } from 'date-fns'
import { formatNumber } from '@/lib/utils'

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
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 text-base px-4 py-2">
          <XCircle className="mr-2 h-5 w-5" />
          Đã hết hạn
        </Badge>
      )
    case 'expiring-soon':
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-base px-4 py-2">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Sắp hết hạn
        </Badge>
      )
    case 'expiring-warning':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-base px-4 py-2">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Cảnh báo hết hạn
        </Badge>
      )
    case 'ok':
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 text-base px-4 py-2">
          <CheckCircle2 className="mr-2 h-5 w-5" />
          Còn hạn sử dụng
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary" className="text-base px-4 py-2">
          Không có hạn sử dụng
        </Badge>
      )
  }
}

export default function LotDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lotId = parseInt(params.id as string)

  const [lot, setLot] = useState<LotSerial | null>(null)
  const [stockQuants, setStockQuants] = useState<StockQuant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadLotDetail() {
      try {
        const lotData = await MockDataService.getLotSerial(lotId)
        setLot(lotData)

        // Filter quants by this lot (would need lot_id in quants in real implementation)
        // For now, show quants for this product
        if (lotData) {
          const productQuants = await MockDataService.getStockQuantsByProduct(lotData.product_id[0])
          setStockQuants(productQuants)
        }
      } catch (error) {
        console.error('Failed to load lot detail:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadLotDetail()
  }, [lotId])

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

  if (!lot) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Không tìm thấy lot/serial</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const daysUntilExpiry = lot.expiration_date
    ? differenceInDays(new Date(lot.expiration_date), new Date())
    : null
  const status = getExpiryStatus(lot.expiration_date)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{lot.name}</h1>
            <p className="text-muted-foreground mt-1">
              Chi tiết Lot/Serial Number
            </p>
          </div>
        </div>

        <div>
          {getExpiryBadge(lot.expiration_date)}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số lượng hiện tại</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(lot.product_qty)}</div>
            <p className="text-xs text-muted-foreground mt-1">Đơn vị tính</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ngày tạo</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(new Date(lot.create_date), 'dd/MM/yyyy')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(lot.create_date), 'HH:mm:ss')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {lot.expiration_date ? 'Hạn sử dụng' : 'Trạng thái'}
            </CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {lot.expiration_date ? (
              <>
                <div className={`text-2xl font-bold ${
                  status === 'expired' ? 'text-red-600' :
                  status === 'expiring-soon' ? 'text-orange-600' :
                  status === 'expiring-warning' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {format(new Date(lot.expiration_date), 'dd/MM/yyyy')}
                </div>
                {daysUntilExpiry !== null && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {daysUntilExpiry > 0
                      ? `Còn ${daysUntilExpiry} ngày`
                      : `Quá hạn ${Math.abs(daysUntilExpiry)} ngày`
                    }
                  </p>
                )}
              </>
            ) : (
              <div className="text-xl font-bold text-muted-foreground">
                Không có hạn
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lot Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin Lot/Serial</CardTitle>
            <CardDescription>
              Chi tiết về lot/serial number này
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Product */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Sản phẩm</p>
              <Link
                href={`/inventory/${lot.product_id[0]}`}
                className="font-medium text-blue-600 hover:underline flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                {lot.product_id[1]}
              </Link>
            </div>

            <Separator />

            {/* Dates */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ngày tạo:</span>
                <span className="font-medium">
                  {format(new Date(lot.create_date), 'dd/MM/yyyy HH:mm')}
                </span>
              </div>

              {lot.expiration_date && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Hạn sử dụng:</span>
                  <span className={`font-medium ${
                    status === 'expired' ? 'text-red-600' :
                    status === 'expiring-soon' ? 'text-orange-600' :
                    status === 'expiring-warning' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {format(new Date(lot.expiration_date), 'dd/MM/yyyy')}
                  </span>
                </div>
              )}

              {lot.use_date && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ngày nên dùng trước:</span>
                  <span className="font-medium">
                    {format(new Date(lot.use_date), 'dd/MM/yyyy')}
                  </span>
                </div>
              )}

              {lot.alert_date && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ngày cảnh báo:</span>
                  <span className="font-medium text-yellow-600">
                    {format(new Date(lot.alert_date), 'dd/MM/yyyy')}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* Company */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Công ty</p>
              <p className="font-medium">{lot.company_id[1]}</p>
            </div>

            {/* Note */}
            {lot.note && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
                  <p className="font-medium italic">{lot.note}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Stock by Location */}
        <Card>
          <CardHeader>
            <CardTitle>Tồn kho theo vị trí</CardTitle>
            <CardDescription>
              Phân bổ tồn kho của sản phẩm này
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stockQuants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Chưa có tồn kho</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stockQuants.map((quant) => (
                  <div key={quant.id} className="flex items-start justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {quant.location_id[1]}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-muted-foreground">
                          Có sẵn: <span className="font-semibold text-foreground">{formatNumber(quant.quantity)}</span>
                        </span>
                        {quant.reserved_quantity > 0 && (
                          <span className="text-muted-foreground">
                            Đã đặt: <span className="font-semibold text-orange-600">{formatNumber(quant.reserved_quantity)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Button size="lg">
              <FileText className="mr-2 h-5 w-5" />
              Xem lịch sử chuyển động
            </Button>
            <Button variant="outline" size="lg">
              In nhãn Lot/Serial
            </Button>
            {status === 'expired' && (
              <Button variant="destructive" size="lg">
                <XCircle className="mr-2 h-5 w-5" />
                Loại bỏ lot hết hạn
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

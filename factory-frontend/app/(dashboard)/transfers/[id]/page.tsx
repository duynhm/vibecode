'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowRightLeft,
  Package,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { MockDataService } from '@/lib/mock/data'
import { StockPicking, StockMove, PickingState } from '@/types'
import { format } from 'date-fns'
import { formatNumber } from '@/lib/utils'

const getStateColor = (state: PickingState) => {
  switch (state) {
    case 'done':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'assigned':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'confirmed':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'cancel':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStateLabel = (state: PickingState) => {
  switch (state) {
    case 'draft':
      return 'Nháp'
    case 'waiting':
      return 'Chờ'
    case 'confirmed':
      return 'Đã xác nhận'
    case 'assigned':
      return 'Sẵn sàng'
    case 'done':
      return 'Hoàn thành'
    case 'cancel':
      return 'Đã hủy'
    default:
      return state
  }
}

const getTypeIcon = (typeName: string) => {
  if (typeName.includes('Nhập')) return <ArrowDownToLine className="h-6 w-6" />
  if (typeName.includes('Giao') || typeName.includes('Xuất')) return <ArrowUpFromLine className="h-6 w-6" />
  return <ArrowRightLeft className="h-6 w-6" />
}

export default function TransferDetailPage() {
  const params = useParams()
  const router = useRouter()
  const pickingId = parseInt(params.id as string)

  const [picking, setPicking] = useState<StockPicking | null>(null)
  const [moves, setMoves] = useState<StockMove[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTransferDetail() {
      try {
        const [pickingData, movesData] = await Promise.all([
          MockDataService.getPicking(pickingId),
          MockDataService.getStockMovesByPicking(pickingId),
        ])

        setPicking(pickingData)
        setMoves(movesData)
      } catch (error) {
        console.error('Failed to load transfer detail:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTransferDetail()
  }, [pickingId])

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

  if (!picking) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Không tìm thấy phiếu kho</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalQty = moves.reduce((sum, m) => sum + m.product_uom_qty, 0)
  const doneQty = moves.reduce((sum, m) => sum + m.quantity_done, 0)
  const progress = totalQty > 0 ? Math.round((doneQty / totalQty) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              {getTypeIcon(picking.picking_type_id[1])}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{picking.name}</h1>
              <p className="text-muted-foreground mt-1">
                {picking.picking_type_id[1]}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {picking.origin && (
            <Badge variant="outline" className="text-base px-3 py-1">
              {picking.origin}
            </Badge>
          )}
          <Badge className={`text-base px-4 py-2 ${getStateColor(picking.state)}`}>
            {getStateLabel(picking.state)}
          </Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số lượng</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(totalQty)}</div>
            <p className="text-xs text-muted-foreground mt-1">{moves.length} sản phẩm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xử lý</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(doneQty)}</div>
            <p className="text-xs text-muted-foreground mt-1">{progress}% hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {picking.date_done ? 'Hoàn thành' : 'Dự kiến'}
            </CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {picking.date_done
                ? format(new Date(picking.date_done), 'dd/MM/yyyy')
                : format(new Date(picking.scheduled_date), 'dd/MM/yyyy')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {picking.date_done
                ? format(new Date(picking.date_done), 'HH:mm')
                : format(new Date(picking.scheduled_date), 'HH:mm')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Transfer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin phiếu kho</CardTitle>
            <CardDescription>
              Chi tiết về giao dịch kho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Partner */}
            {picking.partner_id && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Đối tác</p>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{picking.partner_id[1]}</p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Locations */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Kho nguồn</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  <p className="font-medium">{picking.location_id[1]}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Kho đích</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <p className="font-medium">{picking.location_dest_id[1]}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Dates */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ngày dự kiến:</span>
                <span className="font-medium">
                  {format(new Date(picking.scheduled_date), 'dd/MM/yyyy HH:mm')}
                </span>
              </div>
              {picking.date_done && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ngày hoàn thành:</span>
                  <span className="font-medium text-green-600">
                    {format(new Date(picking.date_done), 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stock Moves */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <CardDescription>
              Chi tiết các sản phẩm trong phiếu kho
            </CardDescription>
          </CardHeader>
          <CardContent>
            {moves.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Không có sản phẩm nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {moves.map((move) => (
                  <div key={move.id} className="flex items-start justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium">{move.product_id[1]}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Dự kiến: {formatNumber(move.product_uom_qty)} {move.product_uom[1]}
                      </p>
                      {move.quantity_done > 0 && (
                        <p className="text-sm text-green-600 mt-0.5">
                          Đã xử lý: {formatNumber(move.quantity_done)} {move.product_uom[1]}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {move.quantity_done >= move.product_uom_qty ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Badge variant="outline">
                          {Math.round((move.quantity_done / move.product_uom_qty) * 100)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {picking.state === 'draft' && (
          <>
            <Button size="lg">
              <CheckCircle className="mr-2 h-5 w-5" />
              Xác nhận phiếu
            </Button>
            <Button variant="outline" size="lg">
              <XCircle className="mr-2 h-5 w-5" />
              Hủy phiếu
            </Button>
          </>
        )}
        {picking.state === 'assigned' && (
          <>
            <Button size="lg">
              <CheckCircle className="mr-2 h-5 w-5" />
              Hoàn thành phiếu
            </Button>
            <Button variant="outline" size="lg">
              Cập nhật số lượng
            </Button>
          </>
        )}
        {picking.state === 'confirmed' && (
          <Button size="lg">
            <CheckCircle className="mr-2 h-5 w-5" />
            Kiểm tra tồn kho
          </Button>
        )}
        {picking.state === 'done' && (
          <Button variant="outline" size="lg">
            In phiếu kho
          </Button>
        )}
      </div>
    </div>
  )
}

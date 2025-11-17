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
  Package2,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  FileText,
  Truck,
  MapPin,
  Calendar,
  Waves,
  Printer,
  CheckSquare
} from 'lucide-react'
import { MockDataService } from '@/lib/mock/data'
import { WaveTransfer, StockPicking, StockMove } from '@/types'
import { format } from 'date-fns'
import { formatNumber } from '@/lib/utils'

const getStateBadge = (state: string) => {
  switch (state) {
    case 'draft':
      return (
        <Badge variant="secondary" className="text-base px-4 py-2">
          <FileText className="mr-2 h-5 w-5" />
          Nháp
        </Badge>
      )
    case 'confirmed':
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-base px-4 py-2">
          <CheckSquare className="mr-2 h-5 w-5" />
          Đã xác nhận
        </Badge>
      )
    case 'in_progress':
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-base px-4 py-2">
          <PlayCircle className="mr-2 h-5 w-5" />
          Đang xử lý
        </Badge>
      )
    case 'done':
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 text-base px-4 py-2">
          <CheckCircle2 className="mr-2 h-5 w-5" />
          Hoàn thành
        </Badge>
      )
    case 'cancel':
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 text-base px-4 py-2">
          <XCircle className="mr-2 h-5 w-5" />
          Đã hủy
        </Badge>
      )
    default:
      return <Badge variant="secondary">{state}</Badge>
  }
}

const getPickingStateBadge = (state: string) => {
  switch (state) {
    case 'draft':
      return <Badge variant="secondary">Nháp</Badge>
    case 'waiting':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Chờ</Badge>
    case 'confirmed':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Đã xác nhận</Badge>
    case 'assigned':
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Đã giao</Badge>
    case 'done':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Hoàn thành</Badge>
    case 'cancel':
      return <Badge className="bg-red-100 text-red-800 border-red-200">Đã hủy</Badge>
    default:
      return <Badge variant="secondary">{state}</Badge>
  }
}

const getGroupLabel = (groupedBy: string) => {
  switch (groupedBy) {
    case 'product':
      return 'Sản phẩm'
    case 'category':
      return 'Danh mục'
    case 'location':
      return 'Vị trí'
    default:
      return groupedBy
  }
}

export default function WaveDetailPage() {
  const params = useParams()
  const router = useRouter()
  const waveId = parseInt(params.id as string)

  const [wave, setWave] = useState<WaveTransfer | null>(null)
  const [pickings, setPickings] = useState<StockPicking[]>([])
  const [allMoves, setAllMoves] = useState<StockMove[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadWaveDetail() {
      try {
        const waveData = await MockDataService.getWaveTransfer(waveId)
        setWave(waveData)

        if (waveData) {
          // Load all pickings in this wave
          const pickingsData = await MockDataService.getPickingsByWave(waveId)
          setPickings(pickingsData)

          // Load all moves from all pickings to get consolidated product list
          const movesPromises = pickingsData.map((p) =>
            MockDataService.getStockMovesByPicking(p.id)
          )
          const movesArrays = await Promise.all(movesPromises)
          const moves = movesArrays.flat()
          setAllMoves(moves)
        }
      } catch (error) {
        console.error('Failed to load wave detail:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWaveDetail()
  }, [waveId])

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

  if (!wave) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <Waves className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Không tìm thấy wave</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Consolidate products from all moves
  const productMap = new Map<number, { name: string; totalQty: number; moves: StockMove[] }>()
  allMoves.forEach((move) => {
    const productId = move.product_id[0]
    if (productMap.has(productId)) {
      const existing = productMap.get(productId)!
      existing.totalQty += move.product_uom_qty
      existing.moves.push(move)
    } else {
      productMap.set(productId, {
        name: move.product_id[1],
        totalQty: move.product_uom_qty,
        moves: [move]
      })
    }
  })

  const consolidatedProducts = Array.from(productMap.entries()).map(([id, data]) => ({
    id,
    ...data
  }))

  // Sort by total quantity descending (most picked products first)
  consolidatedProducts.sort((a, b) => b.totalQty - a.totalQty)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{wave.name}</h1>
            <p className="text-muted-foreground mt-1">
              Chi tiết Wave Transfer
            </p>
          </div>
        </div>

        <div>
          {getStateBadge(wave.state)}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số phiếu kho</CardTitle>
            <Package2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{wave.pickings_count}</div>
            <p className="text-xs text-muted-foreground mt-1">Phiếu trong wave</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
            <Waves className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{consolidatedProducts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Loại sản phẩm khác nhau</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người xử lý</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{wave.user_id[1]}</div>
            <p className="text-xs text-muted-foreground mt-1">Được giao</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Wave Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin Wave</CardTitle>
            <CardDescription>
              Chi tiết về wave transfer này
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Type */}
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Loại wave:</span>
              <Badge variant={wave.wave_type === 'automatic' ? 'default' : 'secondary'}>
                {wave.wave_type === 'automatic' ? 'Tự động' : 'Thủ công'}
              </Badge>
            </div>

            <Separator />

            {/* Grouped by */}
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Gom theo:</span>
              <Badge variant="outline">{getGroupLabel(wave.grouped_by)}</Badge>
            </div>

            <Separator />

            {/* Scheduled date */}
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Ngày lên lịch:
              </span>
              <span className="font-medium">
                {format(new Date(wave.scheduled_date), 'dd/MM/yyyy HH:mm')}
              </span>
            </div>

            {/* Note */}
            {wave.note && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ghi chú:</p>
                  <p className="font-medium italic">{wave.note}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Consolidated Product List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách sản phẩm tổng hợp</CardTitle>
            <CardDescription>
              Tất cả sản phẩm trong wave này (sắp xếp theo số lượng)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {consolidatedProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Chưa có sản phẩm</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {consolidatedProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                        <p className="font-medium">{product.name}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.moves.length} dòng chuyển kho
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {formatNumber(product.totalQty)}
                      </p>
                      <p className="text-xs text-muted-foreground">Tổng số lượng</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pickings in Wave */}
      <Card>
        <CardHeader>
          <CardTitle>Phiếu kho trong Wave</CardTitle>
          <CardDescription>
            Danh sách tất cả các phiếu kho trong wave này
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pickings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Truck className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Chưa có phiếu kho</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pickings.map((picking) => (
                <Link
                  key={picking.id}
                  href={`/transfers/${picking.id}`}
                  className="flex items-start justify-between p-4 rounded-lg border-2 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <p className="font-bold text-lg">{picking.name}</p>
                      {getPickingStateBadge(picking.state)}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Từ:</span>
                        <span className="font-medium">{picking.location_id[1]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Đến:</span>
                        <span className="font-medium">{picking.location_dest_id[1]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Lịch:</span>
                        <span className="font-medium">
                          {format(new Date(picking.scheduled_date), 'dd/MM HH:mm')}
                        </span>
                      </div>
                      {picking.partner_id && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Đối tác:</span>
                          <span className="font-medium">{picking.partner_id[1]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            {wave.state === 'draft' && (
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <CheckSquare className="mr-2 h-5 w-5" />
                Xác nhận Wave
              </Button>
            )}
            {wave.state === 'confirmed' && (
              <Button size="lg">
                <PlayCircle className="mr-2 h-5 w-5" />
                Bắt đầu xử lý Wave
              </Button>
            )}
            {wave.state === 'in_progress' && (
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Hoàn thành Wave
              </Button>
            )}
            <Button variant="outline" size="lg">
              <Printer className="mr-2 h-5 w-5" />
              In danh sách picking
            </Button>
            {wave.state !== 'done' && wave.state !== 'cancel' && (
              <Button variant="destructive" size="lg">
                <XCircle className="mr-2 h-5 w-5" />
                Hủy Wave
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

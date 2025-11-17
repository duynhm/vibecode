'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft, Package, Calendar, MapPin } from 'lucide-react'
import { MockDataService } from '@/lib/mock/data'
import { StockPicking, PickingState } from '@/types'
import { format } from 'date-fns'

type FilterType = 'all' | 'incoming' | 'outgoing' | 'internal'

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
  if (typeName.includes('Nhập')) return <ArrowDownToLine className="h-5 w-5" />
  if (typeName.includes('Giao') || typeName.includes('Xuất')) return <ArrowUpFromLine className="h-5 w-5" />
  return <ArrowRightLeft className="h-5 w-5" />
}

export default function TransfersPage() {
  const [pickings, setPickings] = useState<StockPicking[]>([])
  const [filteredPickings, setFilteredPickings] = useState<StockPicking[]>([])
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPickings() {
      try {
        const data = await MockDataService.getPickings()
        // Sort by scheduled date descending (newest first)
        const sorted = data.sort((a, b) =>
          new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime()
        )
        setPickings(sorted)
        setFilteredPickings(sorted)
      } catch (error) {
        console.error('Failed to load pickings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPickings()
  }, [])

  useEffect(() => {
    if (filterType === 'all') {
      setFilteredPickings(pickings)
    } else {
      const filtered = pickings.filter((p) => {
        const typeName = p.picking_type_id[1].toLowerCase()
        if (filterType === 'incoming') return typeName.includes('nhập')
        if (filterType === 'outgoing') return typeName.includes('giao') || typeName.includes('xuất')
        if (filterType === 'internal') return typeName.includes('chuyển')
        return true
      })
      setFilteredPickings(filtered)
    }
  }, [filterType, pickings])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Phiếu Kho</h1>
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
        <h1 className="text-3xl font-bold">Phiếu Kho</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý nhập/xuất/chuyển kho
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="incoming">Nhập hàng</TabsTrigger>
          <TabsTrigger value="outgoing">Giao hàng</TabsTrigger>
          <TabsTrigger value="internal">Chuyển kho</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Hiển thị {filteredPickings.length} / {pickings.length} phiếu
        </p>
      </div>

      {/* Pickings List */}
      <div className="grid gap-4">
        {filteredPickings.map((picking) => (
          <Card key={picking.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {getTypeIcon(picking.picking_type_id[1])}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{picking.name}</CardTitle>
                      <Badge className={getStateColor(picking.state)}>
                        {getStateLabel(picking.state)}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">
                      {picking.picking_type_id[1]}
                    </CardDescription>
                  </div>
                </div>
                {picking.origin && (
                  <Badge variant="outline" className="ml-2">
                    {picking.origin}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Partner */}
              {picking.partner_id && (
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Đối tác:</span>
                  <span className="font-medium">{picking.partner_id[1]}</span>
                </div>
              )}

              {/* Locations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Từ:</p>
                    <p className="font-medium">{picking.location_id[1]}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Đến:</p>
                    <p className="font-medium">{picking.location_dest_id[1]}</p>
                  </div>
                </div>
              </div>

              {/* Date and Products */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {picking.date_done
                      ? format(new Date(picking.date_done), 'dd/MM/yyyy HH:mm')
                      : format(new Date(picking.scheduled_date), 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{picking.products_count} sản phẩm</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2">
                <Link href={`/transfers/${picking.id}`}>
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
      {filteredPickings.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Không tìm thấy phiếu kho nào
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

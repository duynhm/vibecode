'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Factory, Calendar, User, TrendingUp } from 'lucide-react'
import { MockDataService } from '@/lib/mock/data'
import { MrpProduction, MrpProductionState } from '@/types'
import { formatDate, formatNumber } from '@/lib/utils'

const stateLabels: Record<MrpProductionState, string> = {
  draft: 'Nháp',
  confirmed: 'Đã xác nhận',
  planned: 'Đã lên kế hoạch',
  progress: 'Đang sản xuất',
  to_close: 'Cần đóng',
  done: 'Hoàn thành',
  cancel: 'Đã hủy',
}

const stateColors: Record<MrpProductionState, 'default' | 'secondary' | 'success' | 'warning' | 'info'> = {
  draft: 'default',
  confirmed: 'info',
  planned: 'info',
  progress: 'warning',
  to_close: 'warning',
  done: 'success',
  cancel: 'secondary',
}

export default function ManufacturingPage() {
  const [productions, setProductions] = useState<MrpProduction[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('active')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProductions() {
      try {
        const data = await MockDataService.getProductions()
        setProductions(data)
      } catch (error) {
        console.error('Failed to load productions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProductions()
  }, [])

  const filteredProductions = productions.filter((p) => {
    if (filter === 'active') {
      return ['draft', 'confirmed', 'planned', 'progress'].includes(p.state)
    }
    if (filter === 'done') {
      return p.state === 'done'
    }
    return true
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Sản xuất</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sản xuất</h1>
        <p className="text-muted-foreground mt-2">
          Danh sách lệnh sản xuất
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Tất cả ({productions.length})
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          onClick={() => setFilter('active')}
        >
          Đang hoạt động ({productions.filter(p => ['draft', 'confirmed', 'planned', 'progress'].includes(p.state)).length})
        </Button>
        <Button
          variant={filter === 'done' ? 'default' : 'outline'}
          onClick={() => setFilter('done')}
        >
          Hoàn thành ({productions.filter(p => p.state === 'done').length})
        </Button>
      </div>

      {/* Productions Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredProductions.map((production) => (
          <Card key={production.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Factory className="h-5 w-5" />
                    {production.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {production.product_id[1]}
                  </CardDescription>
                </div>
                <Badge variant={stateColors[production.state]}>
                  {stateLabels[production.state]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quantity */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Số lượng sản xuất:</span>
                <span className="text-2xl font-bold">
                  {formatNumber(production.product_qty)} {production.product_uom_id[1]}
                </span>
              </div>

              {/* Progress */}
              {production.state === 'progress' && production.progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tiến độ:</span>
                    <span className="font-medium">{production.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${production.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Đã sản xuất:</span>
                    <span className="font-medium">{formatNumber(production.qty_produced)} / {formatNumber(production.product_qty)}</span>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="space-y-2 pt-2 border-t">
                {production.user_id && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Người phụ trách:</span>
                    <span className="font-medium">{production.user_id[1]}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Bắt đầu:</span>
                  <span className="font-medium">{formatDate(production.date_planned_start)}</span>
                </div>
                {production.date_finished && (
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-muted-foreground">Hoàn thành:</span>
                    <span className="font-medium">{formatDate(production.date_finished)}</span>
                  </div>
                )}
              </div>

              {/* BoM */}
              <div className="flex items-center justify-between text-sm pt-2">
                <span className="text-muted-foreground">BoM:</span>
                <span className="font-medium">{production.bom_id[1]}</span>
              </div>

              {/* Actions */}
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Xem chi tiết
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProductions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Factory className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Không có lệnh sản xuất nào
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

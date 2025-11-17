'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Package2,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  FileText,
  Search,
  ArrowRight,
  Waves,
  CheckSquare
} from 'lucide-react'
import { MockDataService } from '@/lib/mock/data'
import { WaveTransfer } from '@/types'
import { format } from 'date-fns'

const getStateBadge = (state: string) => {
  switch (state) {
    case 'draft':
      return (
        <Badge variant="secondary" className="text-base">
          <FileText className="mr-1 h-4 w-4" />
          Nháp
        </Badge>
      )
    case 'confirmed':
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-base">
          <CheckSquare className="mr-1 h-4 w-4" />
          Đã xác nhận
        </Badge>
      )
    case 'in_progress':
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-base">
          <PlayCircle className="mr-1 h-4 w-4" />
          Đang xử lý
        </Badge>
      )
    case 'done':
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 text-base">
          <CheckCircle2 className="mr-1 h-4 w-4" />
          Hoàn thành
        </Badge>
      )
    case 'cancel':
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 text-base">
          <XCircle className="mr-1 h-4 w-4" />
          Đã hủy
        </Badge>
      )
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

export default function WavesPage() {
  const router = useRouter()
  const [waves, setWaves] = useState<WaveTransfer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterState, setFilterState] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadWaves() {
      try {
        const data = await MockDataService.getWaveTransfers()
        // Sort by scheduled date (most recent first)
        const sorted = data.sort((a, b) =>
          new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime()
        )
        setWaves(sorted)
      } catch (error) {
        console.error('Failed to load wave transfers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWaves()
  }, [])

  // Filter waves
  const filteredWaves = waves.filter((wave) => {
    // Filter by state
    if (filterState !== 'all' && wave.state !== filterState) {
      return false
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        wave.name.toLowerCase().includes(query) ||
        wave.user_id[1].toLowerCase().includes(query) ||
        wave.note?.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Count by state
  const draftCount = waves.filter((w) => w.state === 'draft').length
  const confirmedCount = waves.filter((w) => w.state === 'confirmed').length
  const inProgressCount = waves.filter((w) => w.state === 'in_progress').length
  const doneCount = waves.filter((w) => w.state === 'done').length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Wave Picking</h1>
        <p className="text-muted-foreground mt-1">
          Gom nhóm phiếu kho theo sản phẩm/danh mục
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wave nháp</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{draftCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Chưa xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xác nhận</CardTitle>
            <CheckSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{confirmedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Sẵn sàng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
            <PlayCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Đang thực hiện</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{doneCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Đã xong</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm wave theo tên, người xử lý..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs by State */}
      <Tabs value={filterState} onValueChange={setFilterState}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Tất cả ({waves.length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Nháp ({draftCount})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Xác nhận ({confirmedCount})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            Đang xử lý ({inProgressCount})
          </TabsTrigger>
          <TabsTrigger value="done">
            Hoàn thành ({doneCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filterState} className="mt-6">
          {filteredWaves.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Waves className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'Không tìm thấy wave nào' : 'Chưa có wave nào'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredWaves.map((wave) => (
                <Card
                  key={wave.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2"
                  onClick={() => router.push(`/waves/${wave.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{wave.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-base">
                          <Users className="h-4 w-4" />
                          {wave.user_id[1]}
                        </CardDescription>
                      </div>
                      {getStateBadge(wave.state)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Pickings count */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Số phiếu kho:</span>
                        <div className="flex items-center gap-1 font-semibold text-lg">
                          <Package2 className="h-5 w-5 text-blue-600" />
                          {wave.pickings_count}
                        </div>
                      </div>

                      {/* Grouped by */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Gom theo:</span>
                        <Badge variant="outline" className="text-sm">
                          {getGroupLabel(wave.grouped_by)}
                        </Badge>
                      </div>

                      {/* Wave type */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Loại:</span>
                        <Badge variant={wave.wave_type === 'automatic' ? 'default' : 'secondary'} className="text-sm">
                          {wave.wave_type === 'automatic' ? 'Tự động' : 'Thủ công'}
                        </Badge>
                      </div>

                      {/* Scheduled date */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Lịch:
                        </span>
                        <span className="font-medium text-sm">
                          {format(new Date(wave.scheduled_date), 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>

                      {/* Note */}
                      {wave.note && (
                        <div className="pt-2 border-t">
                          <p className="text-sm text-muted-foreground italic line-clamp-2">
                            {wave.note}
                          </p>
                        </div>
                      )}

                      {/* View details button */}
                      <Button className="w-full mt-3" size="sm">
                        Xem chi tiết
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Button size="lg">
              <Waves className="mr-2 h-5 w-5" />
              Tạo Wave mới
            </Button>
            <Button variant="outline" size="lg">
              Tự động gom nhóm theo sản phẩm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

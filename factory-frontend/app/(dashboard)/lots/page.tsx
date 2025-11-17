'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Package, Calendar, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { MockDataService } from '@/lib/mock/data'
import { LotSerial } from '@/types'
import { format, differenceInDays } from 'date-fns'
import { formatNumber } from '@/lib/utils'

type FilterType = 'all' | 'expiring' | 'expired' | 'ok'

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
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="mr-1 h-3 w-3" />
          Hết hạn
        </Badge>
      )
    case 'expiring-soon':
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Sắp hết hạn
        </Badge>
      )
    case 'expiring-warning':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Cảnh báo
        </Badge>
      )
    case 'ok':
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Còn hạn
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary">
          Không có hạn
        </Badge>
      )
  }
}

const getDaysUntilExpiry = (expirationDate?: string) => {
  if (!expirationDate) return null
  const days = differenceInDays(new Date(expirationDate), new Date())
  return days
}

export default function LotsPage() {
  const [lots, setLots] = useState<LotSerial[]>([])
  const [filteredLots, setFilteredLots] = useState<LotSerial[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadLots() {
      try {
        const data = await MockDataService.getLotSerials()
        // Sort by expiration date (closest first)
        const sorted = data.sort((a, b) => {
          if (!a.expiration_date) return 1
          if (!b.expiration_date) return -1
          return new Date(a.expiration_date).getTime() - new Date(b.expiration_date).getTime()
        })
        setLots(sorted)
        setFilteredLots(sorted)
      } catch (error) {
        console.error('Failed to load lots:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadLots()
  }, [])

  useEffect(() => {
    let filtered = lots

    // Filter by expiry status
    if (filterType !== 'all') {
      filtered = filtered.filter((lot) => {
        const status = getExpiryStatus(lot.expiration_date)
        if (filterType === 'expired') return status === 'expired'
        if (filterType === 'expiring') return status === 'expiring-soon' || status === 'expiring-warning'
        if (filterType === 'ok') return status === 'ok' || status === 'no-expiry'
        return true
      })
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (lot) =>
          lot.name.toLowerCase().includes(query) ||
          lot.product_id[1].toLowerCase().includes(query) ||
          lot.note?.toLowerCase().includes(query)
      )
    }

    setFilteredLots(filtered)
  }, [filterType, searchQuery, lots])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Lot/Serial Numbers</h1>
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

  const expiredCount = lots.filter((l) => getExpiryStatus(l.expiration_date) === 'expired').length
  const expiringCount = lots.filter((l) => {
    const status = getExpiryStatus(l.expiration_date)
    return status === 'expiring-soon' || status === 'expiring-warning'
  }).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lot/Serial Numbers</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý và theo dõi số lô/serial của sản phẩm
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số Lot/Serial</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lots.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Tất cả lot/serial</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp hết hạn</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{expiringCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Trong 60 ngày tới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hết hạn</CardTitle>
            <XCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{expiredCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Cần xử lý</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Tìm kiếm theo số lot/serial, sản phẩm..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <Tabs value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            Tất cả ({lots.length})
          </TabsTrigger>
          <TabsTrigger value="ok">
            Còn hạn
          </TabsTrigger>
          <TabsTrigger value="expiring">
            Sắp hết ({expiringCount})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Hết hạn ({expiredCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Hiển thị {filteredLots.length} / {lots.length} lot/serial
        </p>
      </div>

      {/* Lots List */}
      <div className="grid gap-4">
        {filteredLots.map((lot) => {
          const daysUntilExpiry = getDaysUntilExpiry(lot.expiration_date)
          const status = getExpiryStatus(lot.expiration_date)

          return (
            <Card
              key={lot.id}
              className={`hover:shadow-lg transition-shadow ${
                status === 'expired' ? 'border-red-200 bg-red-50' :
                status === 'expiring-soon' ? 'border-orange-200 bg-orange-50' :
                status === 'expiring-warning' ? 'border-yellow-200 bg-yellow-50' :
                ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{lot.name}</CardTitle>
                      {getExpiryBadge(lot.expiration_date)}
                    </div>
                    <CardDescription className="mt-1">
                      <Link
                        href={`/inventory/${lot.product_id[0]}`}
                        className="hover:underline text-blue-600"
                      >
                        {lot.product_id[1]}
                      </Link>
                    </CardDescription>
                  </div>
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Quantity */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Số lượng:</span>
                  <span className="text-xl font-bold">
                    {formatNumber(lot.product_qty)}
                  </span>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm pt-2 border-t">
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
                            ({daysUntilExpiry > 0 ? `còn ${daysUntilExpiry} ngày` : `quá hạn ${Math.abs(daysUntilExpiry)} ngày`})
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Note */}
                {lot.note && (
                  <div className="text-sm text-muted-foreground pt-2 border-t">
                    <p className="text-xs mb-1">Ghi chú:</p>
                    <p className="italic">{lot.note}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2">
                  <Link href={`/lots/${lot.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredLots.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Không tìm thấy lot/serial nào
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

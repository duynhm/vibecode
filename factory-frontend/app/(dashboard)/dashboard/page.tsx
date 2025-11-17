'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Factory, TrendingUp, TrendingDown } from 'lucide-react'
import { MockDataService } from '@/lib/mock/data'
import { Product, MrpProduction } from '@/types'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    activeProductions: 0,
    completedToday: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [products, productions] = await Promise.all([
          MockDataService.getProducts(),
          MockDataService.getProductions(),
        ])

        const totalStock = products.reduce((sum, p) => sum + p.qty_available, 0)
        const activeProductions = productions.filter(
          (p) => p.state === 'progress' || p.state === 'planned'
        ).length

        const today = new Date().toISOString().split('T')[0]
        const completedToday = productions.filter(
          (p) => p.state === 'done' && p.date_finished?.startsWith(today)
        ).length

        setStats({
          totalProducts: products.length,
          totalStock,
          activeProductions,
          completedToday,
        })
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Tổng quan</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tổng quan</h1>
        <p className="text-muted-foreground mt-2">
          Thống kê tổng quan hệ thống quản lý nhà máy
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng sản phẩm
            </CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Loại sản phẩm đang quản lý
            </p>
          </CardContent>
        </Card>

        {/* Total Stock */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng tồn kho
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStock.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Đơn vị sản phẩm có sẵn
            </p>
          </CardContent>
        </Card>

        {/* Active Productions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lệnh SX đang chạy
            </CardTitle>
            <Factory className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeProductions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Đang trong quá trình sản xuất
            </p>
          </CardContent>
        </Card>

        {/* Completed Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hoàn thành hôm nay
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedToday}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lệnh sản xuất đã hoàn thành
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Truy cập nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/inventory"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-primary" />
                <span className="font-medium">Quản lý Kho</span>
              </div>
              <Badge variant="secondary">{stats.totalProducts} sản phẩm</Badge>
            </a>

            <a
              href="/manufacturing"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <Factory className="h-5 w-5 text-primary" />
                <span className="font-medium">Sản xuất</span>
              </div>
              <Badge variant="secondary">{stats.activeProductions} đang chạy</Badge>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin hệ thống</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Chế độ</span>
              <Badge variant="info">Mock Data</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Phiên bản</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tích hợp Odoo</span>
              <Badge variant="warning">Chưa kết nối</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

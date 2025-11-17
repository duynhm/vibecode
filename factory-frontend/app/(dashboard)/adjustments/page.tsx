'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ClipboardList,
  Plus,
  Trash2,
  Save,
  AlertTriangle,
  CheckCircle2,
  Package
} from 'lucide-react'
import { BarcodeScanner } from '@/components/barcode/BarcodeScanner'
import { Product } from '@/types'
import { formatNumber } from '@/lib/utils'

interface AdjustmentLine {
  product: Product
  systemQty: number
  countedQty: number
  difference: number
}

export default function AdjustmentsPage() {
  const [lines, setLines] = useState<AdjustmentLine[]>([])
  const [showScanner, setShowScanner] = useState(false)

  const handleScan = (product: Product) => {
    // Check if product already in lines
    const existingIndex = lines.findIndex((l) => l.product.id === product.id)

    if (existingIndex >= 0) {
      // Product already scanned, focus on input
      const input = document.getElementById(`qty-${product.id}`) as HTMLInputElement
      input?.focus()
    } else {
      // Add new line
      setLines((prev) => [
        ...prev,
        {
          product,
          systemQty: product.qty_available,
          countedQty: 0,
          difference: -product.qty_available,
        },
      ])
      setShowScanner(false)
    }
  }

  const handleCountedQtyChange = (productId: number, value: string) => {
    const countedQty = parseFloat(value) || 0
    setLines((prev) =>
      prev.map((line) =>
        line.product.id === productId
          ? {
              ...line,
              countedQty,
              difference: countedQty - line.systemQty,
            }
          : line
      )
    )
  }

  const handleRemoveLine = (productId: number) => {
    setLines((prev) => prev.filter((line) => line.product.id !== productId))
  }

  const handleSubmit = () => {
    // In real implementation, this would submit to API
    alert(`Kiểm kê ${lines.length} sản phẩm. Tính năng này sẽ được kết nối với Odoo sau.`)
  }

  const totalDifference = lines.reduce((sum, line) => sum + Math.abs(line.difference), 0)
  const hasDiscrepancies = lines.some((line) => line.difference !== 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kiểm kê Tồn kho</h1>
        <p className="text-muted-foreground mt-2">
          Đếm và điều chỉnh số lượng tồn kho thực tế
        </p>
      </div>

      {/* Scanner Section */}
      {showScanner ? (
        <div className="space-y-4">
          <BarcodeScanner onScan={handleScan} />
          <Button variant="outline" onClick={() => setShowScanner(false)}>
            Đóng máy quét
          </Button>
        </div>
      ) : (
        <Button onClick={() => setShowScanner(true)} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Quét sản phẩm để kiểm kê
        </Button>
      )}

      {/* Adjustment Lines */}
      {lines.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle>Danh sách kiểm kê</CardTitle>
                  <CardDescription>
                    {lines.length} sản phẩm đang được kiểm kê
                  </CardDescription>
                </div>
              </div>
              {hasDiscrepancies && (
                <Badge variant="destructive" className="text-base px-3 py-1">
                  <AlertTriangle className="mr-1 h-4 w-4" />
                  Có chênh lệch
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lines.map((line) => (
                <div
                  key={line.product.id}
                  className={`p-4 rounded-lg border-2 ${
                    line.difference !== 0
                      ? 'border-orange-200 bg-orange-50'
                      : 'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{line.product.name}</p>
                        {line.difference === 0 && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          SKU: {line.product.default_code}
                        </span>
                        {line.product.barcode && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">
                              Barcode: {line.product.barcode}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLine(line.product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* System Quantity */}
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Số lượng hệ thống
                      </Label>
                      <div className="mt-1 p-2 bg-white rounded border">
                        <p className="text-lg font-semibold">
                          {formatNumber(line.systemQty)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {line.product.uom_id[1]}
                        </p>
                      </div>
                    </div>

                    {/* Counted Quantity */}
                    <div>
                      <Label htmlFor={`qty-${line.product.id}`} className="text-xs text-muted-foreground">
                        Số lượng đếm được *
                      </Label>
                      <Input
                        id={`qty-${line.product.id}`}
                        type="number"
                        step="0.01"
                        value={line.countedQty || ''}
                        onChange={(e) =>
                          handleCountedQtyChange(line.product.id, e.target.value)
                        }
                        className="mt-1 h-12 text-lg font-semibold"
                        placeholder="0"
                      />
                    </div>

                    {/* Difference */}
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Chênh lệch
                      </Label>
                      <div className="mt-1 p-2 bg-white rounded border">
                        <p
                          className={`text-lg font-semibold ${
                            line.difference > 0
                              ? 'text-green-600'
                              : line.difference < 0
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {line.difference > 0 && '+'}
                          {formatNumber(line.difference)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {line.product.uom_id[1]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary and Actions */}
      {lines.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Tổng số sản phẩm kiểm kê
                </p>
                <p className="text-2xl font-bold">{lines.length}</p>
              </div>
              {hasDiscrepancies && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Tổng chênh lệch tuyệt đối
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatNumber(totalDifference)}
                  </p>
                </div>
              )}
              <Button size="lg" onClick={handleSubmit} disabled={lines.length === 0}>
                <Save className="mr-2 h-5 w-5" />
                Lưu kiểm kê
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {lines.length === 0 && !showScanner && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">
              Chưa có sản phẩm nào để kiểm kê
            </p>
            <p className="text-sm text-muted-foreground">
              Nhấn nút "Quét sản phẩm" để bắt đầu kiểm kê tồn kho
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

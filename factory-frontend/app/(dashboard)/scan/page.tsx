'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarcodeScanner } from '@/components/barcode/BarcodeScanner'
import { Package, History, ExternalLink } from 'lucide-react'
import { Product } from '@/types'
import { formatNumber } from '@/lib/utils'
import { format } from 'date-fns'

interface ScanHistoryItem {
  product: Product
  scannedAt: Date
}

export default function ScanPage() {
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([])

  const handleScan = (product: Product) => {
    setScanHistory((prev) => [
      { product, scannedAt: new Date() },
      ...prev.slice(0, 9), // Keep last 10 scans
    ])
  }

  const handleClearHistory = () => {
    setScanHistory([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quét Barcode</h1>
        <p className="text-muted-foreground mt-2">
          Quét mã vạch để tra cứu thông tin sản phẩm nhanh chóng
        </p>
      </div>

      {/* Scanner */}
      <BarcodeScanner onScan={handleScan} />

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle>Lịch sử quét</CardTitle>
                  <CardDescription>
                    {scanHistory.length} sản phẩm đã quét gần đây
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearHistory}>
                Xóa lịch sử
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scanHistory.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.product.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {item.product.categ_id[1]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          SKU: {item.product.default_code}
                        </span>
                        {item.product.barcode && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">
                              Barcode: {item.product.barcode}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm">
                          <span className="text-muted-foreground">Tồn kho:</span>{' '}
                          <span className="font-semibold">
                            {formatNumber(item.product.qty_available)}
                          </span>{' '}
                          {item.product.uom_id[1]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(item.scannedAt, 'HH:mm:ss')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/inventory/${item.product.id}`}>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {scanHistory.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              Chưa có lịch sử quét mã
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Quét mã vạch sản phẩm để bắt đầu
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

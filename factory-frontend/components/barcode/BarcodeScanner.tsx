'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScanLine, X, CheckCircle2 } from 'lucide-react'
import { Product } from '@/types'
import { MockDataService } from '@/lib/mock/data'

interface BarcodeScannerProps {
  onScan?: (product: Product) => void
  onError?: (error: string) => void
  autoFocus?: boolean
  placeholder?: string
}

export function BarcodeScanner({
  onScan,
  onError,
  autoFocus = true,
  placeholder = 'Quét hoặc nhập barcode/SKU...'
}: BarcodeScannerProps) {
  const [barcode, setBarcode] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [lastScannedProduct, setLastScannedProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleScan = async (code: string) => {
    if (!code.trim()) return

    setIsScanning(true)
    setError(null)
    setLastScannedProduct(null)

    try {
      // Search for product by barcode or SKU
      const products = await MockDataService.getProducts()
      const product = products.find(
        (p) =>
          p.barcode?.toLowerCase() === code.toLowerCase() ||
          p.default_code.toLowerCase() === code.toLowerCase()
      )

      if (product) {
        setLastScannedProduct(product)
        onScan?.(product)
        // Auto-clear after 2 seconds
        setTimeout(() => {
          setBarcode('')
          setLastScannedProduct(null)
          inputRef.current?.focus()
        }, 2000)
      } else {
        const errorMsg = 'Không tìm thấy sản phẩm với mã này'
        setError(errorMsg)
        onError?.(errorMsg)
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi quét mã'
      setError(errorMsg)
      onError?.(errorMsg)
    } finally {
      setIsScanning(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleScan(barcode)
  }

  const handleClear = () => {
    setBarcode('')
    setError(null)
    setLastScannedProduct(null)
    inputRef.current?.focus()
  }

  return (
    <div className="space-y-4">
      {/* Scanner Input */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ScanLine className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Quét Barcode</CardTitle>
              <CardDescription>
                Sử dụng máy quét hoặc nhập mã thủ công
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder={placeholder}
                  className="text-lg h-14 pr-10"
                  disabled={isScanning}
                />
                {barcode && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={!barcode.trim() || isScanning}
                className="h-14 px-8"
              >
                {isScanning ? 'Đang quét...' : 'Quét'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Scan Result */}
      {lastScannedProduct && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 mt-1" />
              <div className="flex-1">
                <p className="font-semibold text-green-900">{lastScannedProduct.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-white">
                    SKU: {lastScannedProduct.default_code}
                  </Badge>
                  {lastScannedProduct.barcode && (
                    <Badge variant="outline" className="bg-white">
                      Barcode: {lastScannedProduct.barcode}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-green-700 mt-2">
                  Tồn kho: <span className="font-semibold">{lastScannedProduct.qty_available}</span> {lastScannedProduct.uom_id[1]}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <X className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <p className="font-semibold text-red-900">{error}</p>
                <p className="text-sm text-red-700 mt-1">
                  Vui lòng kiểm tra lại mã và thử lại
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

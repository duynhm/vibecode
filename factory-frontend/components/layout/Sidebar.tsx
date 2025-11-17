'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Package, Factory, Truck, ScanLine, ClipboardList, LucideIcon } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Tổng quan',
    icon: Home,
  },
  {
    href: '/inventory',
    label: 'Quản lý Kho',
    icon: Package,
  },
  {
    href: '/transfers',
    label: 'Phiếu Kho',
    icon: Truck,
  },
  {
    href: '/scan',
    label: 'Quét Barcode',
    icon: ScanLine,
  },
  {
    href: '/adjustments',
    label: 'Kiểm kê',
    icon: ClipboardList,
  },
  {
    href: '/manufacturing',
    label: 'Sản xuất',
    icon: Factory,
  },
]

interface SidebarProps {
  isOpen: boolean
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => {}}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="p-4 space-y-2 mt-16 lg:mt-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors touch-target',
                  'hover:bg-gray-100 active:bg-gray-200',
                  isActive && 'bg-blue-50 text-blue-700 font-medium'
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-base">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

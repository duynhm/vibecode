'use client'

import { useAuth } from '@/lib/auth-context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOut, Menu, X } from 'lucide-react'
import { Factory } from 'lucide-react'

interface HeaderProps {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export function Header({ sidebarOpen, toggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 h-full">
        {/* Left: Logo + Menu Toggle */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Factory className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold hidden sm:block">
              Factory Management
            </h1>
          </div>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.department}</p>
          </div>

          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Đăng xuất"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

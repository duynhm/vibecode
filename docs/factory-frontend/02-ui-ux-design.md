# UI/UX Design - Tablet-Optimized Interface

## 1. Design Principles

### Cho nhân viên nhà máy
- ✅ **Large touch targets** (min 44x44px, recommended 56x56px)
- ✅ **High contrast colors** (dễ nhìn trong điều kiện ánh sáng kém)
- ✅ **Minimal text input** (ưu tiên scan barcode, select dropdown)
- ✅ **Clear visual feedback** (loading states, success/error messages)
- ✅ **Simple navigation** (max 3 levels deep)
- ✅ **Undo/Cancel options** (phòng tránh thao tác nhầm)

### Responsive Breakpoints

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'sm': '640px',   // Small tablet portrait
      'md': '768px',   // Tablet portrait
      'lg': '1024px',  // Tablet landscape
      'xl': '1280px',  // Large tablet
    },
  },
}
```

---

## 2. Master Layout Structure

### Desktop/Landscape Mode (≥1024px)
```
┌─────────────────────────────────────────────────────┐
│ Header: Logo | User Menu | Notifications           │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │         Main Content                     │
│          │                                          │
│ - Home   │  ┌────────────────────────────────────┐ │
│ - Inv    │  │                                    │ │
│ - Mfg    │  │     Page Content                   │ │
│          │  │                                    │ │
│          │  └────────────────────────────────────┘ │
│          │                                          │
│          │  [Action Buttons - Bottom Right]        │
└──────────┴──────────────────────────────────────────┘
```

### Tablet Portrait Mode (768px - 1023px)
```
┌─────────────────────────────────────┐
│ Header + Hamburger Menu             │
├─────────────────────────────────────┤
│                                     │
│        Main Content                 │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │     Page Content              │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  [Bottom Navigation Bar]            │
└─────────────────────────────────────┘
```

### Mobile Mode (<768px) - Optional Support
```
┌─────────────────────┐
│ Header + Menu       │
├─────────────────────┤
│                     │
│   Content           │
│   (Stacked)         │
│                     │
└─────────────────────┘
│ Bottom Nav          │
└─────────────────────┘
```

---

## 3. Component Design Specifications

### 3.1 Header Component

**Landscape Mode:**
```tsx
<header className="h-16 bg-white border-b shadow-sm sticky top-0 z-50">
  <div className="flex items-center justify-between px-6">
    {/* Logo */}
    <div className="flex items-center gap-3">
      <Image src="/logo.png" width={40} height={40} />
      <h1 className="text-xl font-semibold">Factory Management</h1>
    </div>

    {/* Right side */}
    <div className="flex items-center gap-4">
      {/* Notifications */}
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</header>
```

**Portrait Mode:**
```tsx
{/* Hamburger menu + compact header */}
<Button variant="ghost" size="icon" onClick={toggleMenu}>
  <Menu className="h-6 w-6" />
</Button>
```

---

### 3.2 Sidebar Navigation (Desktop/Landscape)

```tsx
<aside className="w-64 bg-gray-50 border-r h-full overflow-y-auto">
  <nav className="p-4 space-y-2">
    <NavItem icon={Home} label="Dashboard" href="/dashboard" />
    <NavItem icon={Package} label="Inventory" href="/inventory" active />
    <NavItem icon={Factory} label="Manufacturing" href="/manufacturing" />

    {/* Accordion for sub-menus */}
    <Accordion type="single" collapsible>
      <AccordionItem value="inventory">
        <AccordionTrigger className="text-sm font-medium">
          Inventory
        </AccordionTrigger>
        <AccordionContent>
          <NavSubItem label="Products" href="/inventory/products" />
          <NavSubItem label="Locations" href="/inventory/locations" />
          <NavSubItem label="Transfers" href="/inventory/transfers" />
          <NavSubItem label="Adjustments" href="/inventory/adjustments" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </nav>
</aside>
```

**Touch-friendly NavItem:**
```tsx
<Link
  href={href}
  className={cn(
    "flex items-center gap-3 px-4 py-3", // Increased padding for touch
    "rounded-lg transition-colors",
    "hover:bg-gray-100 active:bg-gray-200",
    active && "bg-blue-50 text-blue-700 font-medium"
  )}
>
  <Icon className="h-6 w-6" /> {/* Large icons */}
  <span className="text-base">{label}</span> {/* Readable text size */}
</Link>
```

---

### 3.3 Bottom Navigation (Portrait Mode)

```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 lg:hidden">
  <div className="flex items-center justify-around h-full">
    <NavButton icon={Home} label="Home" href="/dashboard" />
    <NavButton icon={Package} label="Inventory" href="/inventory" active />
    <NavButton icon={Factory} label="Mfg" href="/manufacturing" />
    <NavButton icon={User} label="Profile" href="/profile" />
  </div>
</nav>

{/* NavButton Component */}
<button className="flex flex-col items-center justify-center w-20 h-full gap-1">
  <Icon className="h-6 w-6" />
  <span className="text-xs">{label}</span>
</button>
```

---

### 3.4 Data Table (Tablet-Optimized)

**Card-based layout cho mobile:**
```tsx
{/* Desktop: Table */}
<Table className="hidden lg:table">
  <TableHeader>
    <TableRow>
      <TableHead>Product</TableHead>
      <TableHead>SKU</TableHead>
      <TableHead>Qty</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {products.map((product) => (
      <TableRow key={product.id}>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.default_code}</TableCell>
        <TableCell>{product.qty_available}</TableCell>
        <TableCell>
          <Button size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

{/* Tablet/Mobile: Cards */}
<div className="lg:hidden grid gap-4">
  {products.map((product) => (
    <Card key={product.id}>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>SKU: {product.default_code}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold">{product.qty_available}</p>
            <p className="text-sm text-gray-500">Available</p>
          </div>
          <Button size="lg">View</Button>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

---

### 3.5 Barcode Scanner Interface

```tsx
<Dialog open={scannerActive} onOpenChange={toggleScanner}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>Scan Barcode</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      {/* Camera viewfinder */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video ref={videoRef} className="w-full h-full object-cover" />
        {/* Scanning overlay */}
        <div className="absolute inset-0 border-4 border-blue-500 animate-pulse" />
      </div>

      {/* Manual input fallback */}
      <div className="space-y-2">
        <Label>Or enter manually:</Label>
        <Input
          type="text"
          placeholder="Enter barcode"
          className="text-lg h-12" // Large input for easy typing
        />
      </div>

      {/* Result */}
      {scannedProduct && (
        <Alert>
          <CheckCircle className="h-5 w-5" />
          <AlertTitle>Product Found</AlertTitle>
          <AlertDescription>{scannedProduct.name}</AlertDescription>
        </Alert>
      )}
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={toggleScanner}>Cancel</Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 4. Color Palette

### Primary Colors (High Contrast)
```typescript
export const colors = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6', // Main blue
    600: '#2563eb',
    700: '#1d4ed8',
  },
  success: {
    500: '#10b981', // Green
    600: '#059669',
  },
  warning: {
    500: '#f59e0b', // Orange
    600: '#d97706',
  },
  danger: {
    500: '#ef4444', // Red
    600: '#dc2626',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    900: '#111827',
  },
}
```

### Status Indicators
```tsx
const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

<Badge className={statusColors[status]}>
  {status.toUpperCase()}
</Badge>
```

---

## 5. Typography Scale

```typescript
// tailwind.config.ts
export default {
  theme: {
    fontSize: {
      'xs': '0.75rem',   // 12px - Captions
      'sm': '0.875rem',  // 14px - Secondary text
      'base': '1rem',    // 16px - Body text (MINIMUM for factory workers)
      'lg': '1.125rem',  // 18px - Large body
      'xl': '1.25rem',   // 20px - Headings
      '2xl': '1.5rem',   // 24px - Page titles
      '3xl': '1.875rem', // 30px - Numbers/Stats
    },
  },
}
```

**Usage Guidelines:**
- Body text: `text-base` (16px) minimum
- Buttons: `text-lg` (18px)
- Numbers/Quantities: `text-3xl` (30px) - Easy to read from distance
- Headers: `text-2xl` (24px)

---

## 6. Touch Gestures Support

### Swipe Actions (Optional Enhancement)
```tsx
import { useSwipeable } from 'react-swipeable'

const handlers = useSwipeable({
  onSwipedLeft: () => handleDelete(),
  onSwipedRight: () => handleEdit(),
  preventScrollOnSwipe: true,
  trackMouse: true, // Also works with mouse
})

<div {...handlers} className="relative">
  {/* List item */}
  <Card>...</Card>

  {/* Swipe indicator */}
  <div className="absolute right-0 top-0 bottom-0 bg-red-500 text-white flex items-center px-4">
    <Trash2 className="h-6 w-6" />
  </div>
</div>
```

---

## 7. Loading States & Feedback

### Skeleton Loaders
```tsx
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-32" /> {/* Title */}
    <Skeleton className="h-4 w-24 mt-2" /> {/* Subtitle */}
  </CardHeader>
  <CardContent>
    <Skeleton className="h-20 w-full" />
  </CardContent>
</Card>
```

### Success/Error Toast
```tsx
import { toast } from "sonner"

// Success
toast.success("Product updated successfully", {
  duration: 3000,
  icon: <CheckCircle className="h-5 w-5" />,
})

// Error
toast.error("Failed to save changes", {
  duration: 5000,
  icon: <XCircle className="h-5 w-5" />,
  action: {
    label: "Retry",
    onClick: () => handleRetry(),
  },
})
```

---

## 8. Accessibility (a11y)

### Checklist
- [x] Keyboard navigation support
- [x] Screen reader labels (`aria-label`, `sr-only`)
- [x] Focus indicators (outline on buttons/links)
- [x] Color contrast ratio ≥4.5:1 (WCAG AA)
- [x] Touch targets ≥44px
- [x] Alt text for images
- [x] Form labels properly associated

### Example
```tsx
<Button
  aria-label="Delete product"
  className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
>
  <Trash2 className="h-5 w-5" />
  <span className="sr-only">Delete</span>
</Button>
```

---

## 9. Dark Mode (Future Enhancement)

```tsx
// Use next-themes
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## 10. Animation & Transitions

**Subtle, performance-friendly animations:**
```tsx
// Button press effect
<Button className="active:scale-95 transition-transform">
  Click Me
</Button>

// Card hover (desktop only)
<Card className="lg:hover:shadow-lg transition-shadow">
  ...
</Card>

// Fade-in page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
```

---

## Next Steps

1. **Create Figma/Sketch mockups** (optional but recommended)
2. **Setup shadcn/ui components**
3. **Build component library** (storybook optional)
4. **User testing with real factory workers** 🔑

See `03-inventory-features.md` for detailed Inventory module specs.

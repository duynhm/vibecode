# Factory Management Frontend

Ứng dụng quản lý kho và sản xuất tối ưu cho tablet, tích hợp với Odoo 18.

## 🚀 Quick Start

### 1. Cài đặt dependencies

```bash
cd factory-frontend
npm install
```

### 2. Cấu hình môi trường

Copy file `.env.example` thành `.env.local`:

```bash
cp .env.example .env.local
```

Nội dung `.env.local`:
```env
NEXT_PUBLIC_APP_NAME="Factory Management"
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MOCK_MODE=true
```

### 3. Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại: **http://localhost:3000**

### 4. Đăng nhập

Sử dụng một trong các tài khoản demo:

| Username | Password | Role | Quyền |
|----------|----------|------|-------|
| `admin` | `123456` | Quản trị | Full access (Inventory + Manufacturing) |
| `manager` | `123456` | Quản lý | Manage access (View + Edit) |
| `worker` | `123456` | Công nhân | View only |

## 📱 Tính năng

### Phase 1 (Đã hoàn thành) ✅

- **Authentication**: Mock login với 3 roles
- **Dashboard**: Tổng quan hệ thống
- **Inventory**: Danh sách sản phẩm với search
- **Manufacturing**: Danh sách lệnh sản xuất với filter

### Phase 2 (Sắp tới)

- Product detail page
- Stock transfers (Nhập/Xuất/Chuyển kho)
- Barcode scanner
- Stock adjustments (Kiểm kê)

### Phase 3 (Sắp tới)

- Production order execution
- Work order management
- BoM (Bill of Materials) viewer
- Progress tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript 5.9
- **UI**: React 19 + Tailwind CSS 3.4
- **Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **State**: Zustand + React Context
- **Notifications**: Sonner (toast)

## 📁 Cấu trúc thư mục

```
factory-frontend/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth routes (login)
│   ├── (dashboard)/            # Protected dashboard routes
│   │   ├── dashboard/          # Dashboard page
│   │   ├── inventory/          # Inventory pages
│   │   └── manufacturing/      # Manufacturing pages
│   ├── api/                    # API routes (future)
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page (redirect logic)
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── layout/                 # Header, Sidebar
│   ├── inventory/              # Inventory components
│   └── manufacturing/          # Manufacturing components
├── lib/
│   ├── mock/                   # Mock data & auth services
│   │   ├── auth.ts             # Mock authentication
│   │   ├── data.ts             # Mock API service
│   │   └── users.ts            # Mock users data
│   ├── auth-context.tsx        # Auth context provider
│   └── utils.ts                # Utility functions
├── types/
│   └── index.ts                # TypeScript types
├── data/                       # Mock data JSON files
│   ├── products.json
│   ├── locations.json
│   ├── pickings.json
│   ├── productions.json
│   └── workorders.json
└── public/                     # Static assets
```

## 🔧 Scripts

```bash
# Development
npm run dev          # Chạy dev server (http://localhost:3000)

# Production
npm run build        # Build ứng dụng
npm run start        # Chạy production server

# Utilities
npm run lint         # Chạy ESLint
npm run type-check   # Kiểm tra TypeScript
```

## 🎨 UI/UX

### Responsive Design

- **Desktop** (≥1024px): Full layout với Sidebar
- **Tablet** (768px - 1023px): Collapsible sidebar
- **Mobile** (<768px): Bottom navigation

### Tablet Optimization

- Touch targets: **56x56px** minimum
- Font size: **16px** minimum (base)
- High contrast colors
- Large buttons và form inputs

### Vietnamese Localization

Toàn bộ interface đã được dịch sang tiếng Việt.

## 📊 Mock Data

Hiện tại ứng dụng sử dụng **mock data** từ các file JSON:

- **10 sản phẩm** (products.json)
- **14 locations** (kho/kệ)
- **8 stock pickings** (phiếu nhập/xuất)
- **7 manufacturing orders** (lệnh sản xuất)
- **7 work orders** (công việc sản xuất)

## 🔌 Tích hợp Odoo (Tương lai)

Khi tích hợp với Odoo 18 thực tế:

1. Set `NEXT_PUBLIC_MOCK_MODE=false` trong `.env.local`
2. Cấu hình Odoo credentials:
   ```env
   NEXT_PUBLIC_ODOO_URL=https://your-odoo-instance.com
   NEXT_PUBLIC_ODOO_DB=your_database
   ODOO_USERNAME=admin
   ODOO_PASSWORD=your_password
   ```
3. Implement Odoo API client trong `lib/odoo/`
4. Replace `MockDataService` bằng real API calls

## 🐛 Troubleshooting

### Error: Cannot find module 'tailwindcss-animate'

```bash
npm install
# or
npm install -D tailwindcss-animate
```

### Error: ENOENT .env.local

```bash
cp .env.example .env.local
```

### Port 3000 already in use

```bash
# Chạy trên port khác
PORT=3001 npm run dev
```

## 📚 Documentation

Xem thêm documentation chi tiết tại:
- [00-overview.md](../docs/factory-frontend/00-overview.md) - Tổng quan
- [01-technical-architecture.md](../docs/factory-frontend/01-technical-architecture.md) - Kiến trúc
- [02-ui-ux-design.md](../docs/factory-frontend/02-ui-ux-design.md) - UI/UX
- [03-inventory-features.md](../docs/factory-frontend/03-inventory-features.md) - Inventory
- [04-manufacturing-features.md](../docs/factory-frontend/04-manufacturing-features.md) - Manufacturing

## 📝 License

ISC

---

**Prepared by**: Claude AI
**Date**: November 2024
**Version**: 1.0.0 (Phase 1)

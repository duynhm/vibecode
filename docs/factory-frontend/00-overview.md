# Factory Frontend - Tổng quan dự án

## Mục tiêu
Xây dựng ứng dụng frontend độc lập cho nhân viên nhà máy, tối ưu hóa cho tablet, quản lý nghiệp vụ Inventory và Manufacturing được đồng bộ với Odoo 18.

## Phạm vi dự án

### Đối tượng sử dụng
- **Nhân viên nhà máy**: Ít sử dụng máy tính, thao tác chủ yếu trên tablet
- **Môi trường**: Nhà máy sản xuất, có thể thiếu sáng, ồn ào, cần thao tác nhanh
- **Kỹ năng**: Không chuyên IT, cần UI đơn giản, trực quan

### Modules chính
1. **Inventory (Quản lý Kho)** - Full feature
2. **Manufacturing (Quản lý Sản xuất)** - Full feature

### Yêu cầu kỹ thuật chính
- ✅ Ứng dụng độc lập hoàn toàn (có thể deploy riêng)
- ✅ Đăng nhập qua Odoo account (res.users)
- ✅ Phân quyền theo role của Odoo
- ✅ Tối ưu cho tablet (7-12 inch)
- ✅ Responsive multi-screen support
- ✅ Tích hợp Odoo 18 API

## Tech Stack đề xuất

| Thành phần | Công nghệ | Lý do |
|------------|-----------|-------|
| **Framework** | Next.js 15+ | App Router, RSC, API Routes, Image optimization |
| **Language** | TypeScript 5+ | Type safety, better DX |
| **UI Framework** | React 19 | Latest features, concurrent rendering |
| **Styling** | Tailwind CSS 4 | Utility-first, responsive design |
| **Component Library** | shadcn/ui | Accessible, customizable, tablet-friendly |
| **Icons** | Lucide React | Consistent, SVG-based |
| **HTTP Client** | Axios | Promise-based, interceptors support |
| **State Management** | Zustand / Tanstack Query | Lightweight, server state sync |
| **Session Management** | NextAuth.js v5 (Auth.js) | Custom Odoo provider, JWT/Session |
| **Forms** | React Hook Form + Zod | Validation, performance |
| **Barcode Scanner** | @zxing/browser | QR/Barcode scanning via camera |
| **Date Handling** | date-fns | Lightweight alternative to moment |
| **Testing** | Vitest + Testing Library | Fast, modern testing |

## Cấu trúc thư mục

```
factory-frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/              # Protected route group
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── manufacturing/
│   │   └── layout.tsx            # Master UI layout
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── inventory/
│   │   └── manufacturing/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components
│   ├── inventory/                # Inventory components
│   └── manufacturing/            # Manufacturing components
├── lib/
│   ├── odoo/                     # Odoo API client
│   ├── auth/                     # Auth utilities
│   ├── utils.ts
│   └── constants.ts
├── types/
│   ├── odoo/                     # Odoo model types
│   ├── inventory.ts
│   └── manufacturing.ts
├── hooks/                        # Custom React hooks
├── stores/                       # Zustand stores
├── public/
├── docs/                         # Documentation
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## Timeline ước tính

| Phase | Mô tả | Thời gian |
|-------|-------|-----------|
| **Phase 1** | Setup project, Authentication, Master UI | 2-3 ngày |
| **Phase 2** | Inventory Module - Core features | 3-4 ngày |
| **Phase 3** | Manufacturing Module - Core features | 3-4 ngày |
| **Phase 4** | Advanced features, Barcode scanning | 2-3 ngày |
| **Phase 5** | Testing, Optimization, Documentation | 2 ngày |
| **Total** | | **12-16 ngày** |

## Rủi ro & Giải pháp

| Rủi ro | Giải pháp |
|--------|-----------|
| Odoo 18 API thay đổi nhiều | Research kỹ Odoo 18 JSON-RPC API docs |
| Performance trên tablet cũ | Code splitting, lazy loading, optimize bundle |
| Phân quyền phức tạp | Sync với Odoo groups/rules, cache permissions |
| Offline mode cho nhà máy | Progressive Web App (PWA), Service Worker |
| Barcode scanning accuracy | Multiple scanner libraries, fallback manual input |

## Next Steps

1. ✅ Hoàn thiện documentation
2. 🔄 Review & approve kiến trúc
3. 📝 Setup branch mới
4. 🚀 Bắt đầu implementation

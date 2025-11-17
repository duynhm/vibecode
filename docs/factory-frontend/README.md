# Factory Frontend - Documentation Index

Tài liệu kỹ thuật cho dự án Factory Frontend - Ứng dụng quản lý Kho & Sản xuất tích hợp Odoo 18.

---

## 📚 Mục lục tài liệu

### 1. [Tổng quan dự án](./00-overview.md)
- Mục tiêu & phạm vi dự án
- Đối tượng sử dụng
- Tech stack đề xuất
- Cấu trúc thư mục
- Timeline ước tính
- Rủi ro & giải pháp

### 2. [Kiến trúc kỹ thuật](./01-technical-architecture.md)
- **Session Management**: NextAuth.js với Custom Odoo Provider
- **Odoo 18 API Integration**: Authentication flow, API endpoints
- **Authorization & Permissions**: Odoo groups mapping, route protection
- **State Management**: Tanstack Query + Zustand
- **Performance Optimization**: Code splitting, image optimization
- **Offline Support**: PWA setup
- **Security Checklist**

### 3. [UI/UX Design](./02-ui-ux-design.md)
- Design principles cho tablet
- Responsive breakpoints
- Master layout (Desktop/Tablet/Mobile)
- Component specifications:
  - Header & Navigation
  - Sidebar & Bottom Navigation
  - Data Tables (responsive)
  - Barcode Scanner Interface
- Color palette & Typography
- Touch gestures support
- Loading states & Feedback
- Accessibility (a11y)

### 4. [Module Inventory](./03-inventory-features.md)
- **Odoo Models**: stock.location, product.product, stock.picking, stock.quant, etc.
- **Features**:
  1. Product Management (List, Detail, Search)
  2. Stock Locations (Tree view, Hierarchy)
  3. Stock Transfers (Receipts, Deliveries, Internal)
  4. Stock Adjustments (Inventory counts)
  5. Barcode Scanning (Multi-purpose)
  6. Reports & Analytics (Valuation, History)
  7. Lot/Serial Number Tracking
- **Implementation Priority**: Phase 1-3

### 5. [Module Manufacturing](./04-manufacturing-features.md)
- **Odoo Models**: mrp.production, mrp.bom, mrp.workorder, mrp.workcenter, etc.
- **Features**:
  1. Manufacturing Orders (MO List, Detail, Execution)
  2. Bill of Materials (BoM List, Detail, Explosion view)
  3. Work Orders (Kanban view, Mobile execution)
  4. Work Centers (Dashboard, Scheduling)
  5. Production Planning (Schedule view)
  6. Scrap & Unbuild (Waste management, Disassembly)
  7. Reports & Analytics (Production analysis, WIP)
  8. Mobile Notifications
- **Implementation Priority**: Phase 1-3
- **Integration with Inventory**: Component availability, Auto-reserve, etc.

### 6. [Development Setup](./05-development-setup.md)
- Prerequisites
- Environment variables
- Project initialization (Next.js + dependencies)
- Configuration files (next.config, tailwind, tsconfig)
- VS Code settings
- Git setup
- Development workflow
- Odoo connection test
- Deployment options (Vercel, Docker)
- Troubleshooting

---

## 🚀 Quick Start

### Bước 1: Review Documentation
Đọc toàn bộ tài liệu từ file 00 → 05 để hiểu rõ yêu cầu và kiến trúc.

### Bước 2: Prepare Odoo Environment
Đảm bảo Odoo 18 instance đã:
- ✅ Cài đặt modules: Inventory (stock), Manufacturing (mrp)
- ✅ Có user account để authenticate
- ✅ Cấu hình CORS (nếu cần)

### Bước 3: Setup Development Environment
```bash
# Clone repository
git checkout -b claude/factory-frontend-<session-id>

# Navigate to project directory
cd vibecode

# Create factory-frontend app (chi tiết xem file 05)
npx create-next-app@latest factory-frontend

# Install dependencies
cd factory-frontend
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Odoo credentials
```

### Bước 4: Start Implementation
Follow timeline từ file `00-overview.md`:
- **Phase 1**: Authentication + Master UI (2-3 ngày)
- **Phase 2**: Inventory Module (3-4 ngày)
- **Phase 3**: Manufacturing Module (3-4 ngày)
- **Phase 4**: Advanced features (2-3 ngày)
- **Phase 5**: Testing & Documentation (2 ngày)

---

## 📋 Checklist trước khi bắt đầu code

- [ ] Đã review toàn bộ 6 files documentation
- [ ] Đã có Odoo 18 credentials (URL, DB, Username, Password)
- [ ] Đã verify Odoo modules (stock, mrp) đã được cài đặt
- [ ] Đã chuẩn bị thiết bị tablet để test (hoặc browser responsive mode)
- [ ] Đã setup Node.js 20+ và Git
- [ ] Đã đọc và hiểu session management strategy (NextAuth.js)
- [ ] Đã clear về UI/UX requirements cho tablet

---

## 🎯 Key Design Decisions

### 1. **Ứng dụng độc lập** (Separate app, không tích hợp vào app hiện tại)
- Folder: `/factory-frontend`
- Có thể deploy riêng
- Domain riêng (hoặc subdomain)

### 2. **Authentication qua Odoo res.users**
- Không cần database riêng cho users
- Sync permissions từ Odoo groups
- Session management: NextAuth.js + JWT

### 3. **Full feature cho Inventory & Manufacturing**
- Tất cả tính năng core của Odoo stock & mrp
- Tối ưu cho tablet (touch-friendly, large targets)
- Barcode scanning integrated

### 4. **Tech Stack**
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Tanstack Query + Zustand
- **Auth**: NextAuth.js v5
- **API**: Odoo 18 JSON-RPC

---

## 📞 Support & Feedback

### Trong quá trình development:
- Tham khảo Odoo 18 documentation: https://www.odoo.com/documentation/18.0
- Test API calls với Postman/Insomnia trước khi implement
- Sử dụng Odoo debug mode để xem field names chính xác
- User testing với real factory workers sớm nhất có thể

### Cần bổ sung thông tin:
Nếu cần thêm mockups UI, user flows cụ thể, hoặc business logic chi tiết, vui lòng tạo files trong các folders:
- `docs/factory-frontend/ui-design/` - Wireframes, mockups
- `docs/factory-frontend/user-stories/` - User flows chi tiết
- `docs/factory-frontend/api-examples/` - Sample API requests/responses

---

## ✅ Documentation Status

| File | Status | Mô tả |
|------|--------|-------|
| 00-overview.md | ✅ Complete | Tổng quan dự án |
| 01-technical-architecture.md | ✅ Complete | Kiến trúc kỹ thuật |
| 02-ui-ux-design.md | ✅ Complete | Thiết kế UI/UX |
| 03-inventory-features.md | ✅ Complete | Tính năng Inventory |
| 04-manufacturing-features.md | ✅ Complete | Tính năng Manufacturing |
| 05-development-setup.md | ✅ Complete | Hướng dẫn setup |
| README.md | ✅ Complete | Index & Quick start |

---

## 🎉 Next Steps

**Sẵn sàng bắt đầu implementation!**

Xác nhận với team/stakeholders về:
1. ✅ Technical architecture (NextAuth.js + Odoo session)
2. ✅ UI/UX approach (responsive, tablet-first)
3. ✅ Feature scope (full inventory + manufacturing)
4. ✅ Timeline (12-16 ngày)

Sau khi approved, bắt đầu với:
```bash
git checkout -b claude/factory-frontend-<session-id>
# Start Phase 1: Project setup + Authentication
```

---

**Prepared by**: Claude
**Date**: 2024-01-20
**Version**: 1.0
**For**: VibCode Factory Frontend Project

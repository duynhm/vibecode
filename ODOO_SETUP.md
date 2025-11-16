# Hướng dẫn tích hợp Odoo 18 Community với Website Tuyển dụng

## 📋 Yêu cầu

- Odoo 18 Community đã cài đặt và chạy
- Module Recruitment đã được kích hoạt
- Node.js 18+ đã cài đặt
- Access vào Odoo với quyền admin

## 🔧 PHẦN 1: CẤU HÌNH ODOO

### Bước 1: Kích hoạt Developer Mode

1. Đăng nhập Odoo: `http://localhost:8069`
2. Vào **Settings** → Scroll xuống cuối
3. Click **Activate the developer mode**

### Bước 2: Cài đặt Module Recruitment

1. Vào **Apps** (phải ở Developer Mode)
2. Click **Update Apps List**
3. Search "Recruitment"
4. Click **Install** trên module **Recruitment**

### Bước 3: Tạo API User (Optional nhưng khuyến nghị)

1. Settings → Users & Companies → Users → Create
2. Điền thông tin:
   - **Name**: API User
   - **Login**: api_user
   - **Password**: [chọn password mạnh]
   - **Access Rights**:
     - ✅ Recruitment / Officer: Manage applicants and jobs

### Bước 4: Cấu hình CORS

**Cách 1: Sửa file odoo.conf**

Tìm file config (thường ở `/etc/odoo/odoo.conf`):

```ini
[options]
# Existing config...

# CORS Configuration
proxy_mode = True
xmlrpc_interface = 0.0.0.0
```

Restart Odoo:
```bash
sudo systemctl restart odoo
```

**Cách 2: Sử dụng Nginx Reverse Proxy**

Tạo file `/etc/nginx/sites-available/odoo`:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://127.0.0.1:8069;
        proxy_set_header Host $host;

        # CORS
        add_header 'Access-Control-Allow-Origin' 'http://localhost:3000' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Cookie' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;

        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

Enable và restart:
```bash
sudo ln -s /etc/nginx/sites-available/odoo /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### Bước 5: Tạo Job Positions mẫu

1. Vào **Recruitment** app
2. Click **Job Positions**
3. Create một số job positions:
   - Click **Create**
   - Điền: Name, Department, No. of Recruitment
   - Click **Save**
   - Click **Published** để công khai

## 🧪 PHẦN 2: TEST API

### Bước 1: Cấu hình môi trường

Tạo file `.env.local` (đã có sẵn):

```env
NEXT_PUBLIC_ODOO_URL=http://localhost:8069
NEXT_PUBLIC_ODOO_DB=your_database_name
ODOO_USERNAME=admin
ODOO_PASSWORD=admin
```

**Lấy database name:**
- Vào Odoo → Settings
- Nhìn vào URL: `http://localhost:8069/web#...&db=YOUR_DB_NAME`
- Hoặc check trong file odoo.conf

### Bước 2: Chạy test script

```bash
# Từ thư mục root của project
node scripts/test-odoo-connection.js
```

**Kết quả mong đợi:**

```
🔌 Testing Odoo Connection...

Configuration:
- URL: http://localhost:8069
- Database: vibecode_db
- Username: admin
- Password: ***min

📝 Test 1: Authentication
✅ Authentication successful!
   User ID: 2
   Session ID: abc123...

📝 Test 2: Fetching Jobs
✅ Jobs fetched successfully!
   Total jobs: 3

   Jobs list:
   1. Senior Developer (ID: 1)
      Department: Engineering
      Positions: 2
   2. UX Designer (ID: 2)
      Department: Design
      Positions: 1

📝 Test 3: Creating Test Applicant
✅ Test applicant created successfully!
   Applicant ID: 5
   Job: Senior Developer

🎉 All tests passed!

✅ Your Odoo API is ready for integration!
```

### Bước 3: Test trong Postman (Optional)

**Authentication:**
```
POST http://localhost:8069/web/session/authenticate
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "params": {
    "db": "your_db_name",
    "login": "admin",
    "password": "admin"
  }
}
```

**Get Jobs:**
```
POST http://localhost:8069/web/dataset/call_kw
Content-Type: application/json
Cookie: session_id=YOUR_SESSION_ID

{
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "model": "hr.job",
    "method": "search_read",
    "args": [[["state", "=", "recruit"]]],
    "kwargs": {
      "fields": ["id", "name", "description"]
    }
  }
}
```

## 🚀 PHẦN 3: CHẠY WEBSITE

### Bước 1: Enable Odoo integration trong code

Trong file `app/jobs/page.tsx`, uncomment các dòng:

```typescript
// Hiện tại đang dùng mock data
const jobs = mockJobs;

// Thay bằng:
const { jobs } = await getJobs(); // Fetch từ Odoo
```

### Bước 2: Chạy dev server

```bash
npm run dev
```

Truy cập: `http://localhost:3000`

### Bước 3: Test form ứng tuyển

1. Vào page `/jobs`
2. Click vào một job
3. Điền form application
4. Click Submit
5. Check trong Odoo Recruitment → Applications

## 🐛 TROUBLESHOOTING

### Lỗi: CORS policy blocked

**Nguyên nhân:** CORS chưa được cấu hình

**Giải pháp:**
- Đảm bảo đã cấu hình Nginx hoặc sử dụng extension CORS trong browser (chỉ dev)
- Hoặc dùng Odoo trên cùng domain với Next.js

### Lỗi: Authentication failed

**Kiểm tra:**
- Database name đúng chưa
- Username/password đúng chưa
- User có quyền truy cập Recruitment module không

### Lỗi: ECONNREFUSED

**Nguyên nhân:** Odoo chưa chạy hoặc wrong port

**Giải pháp:**
```bash
# Check Odoo đang chạy
sudo systemctl status odoo

# Hoặc
ps aux | grep odoo

# Check port
netstat -tlnp | grep 8069
```

### Lỗi: No jobs found

**Nguyên nhân:** Chưa tạo jobs hoặc jobs chưa published

**Giải pháp:**
1. Vào Recruitment → Job Positions
2. Tạo job mới
3. Click **Published**

## 📚 TÀI LIỆU THAM KHẢO

- [Odoo External API](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html)
- [Odoo Recruitment Module](https://www.odoo.com/documentation/18.0/applications/hr/recruitment.html)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🔐 BẢO MẬT

**Quan trọng:**
- ❌ KHÔNG commit file `.env.local` vào git
- ✅ Sử dụng user riêng cho API (không dùng admin)
- ✅ Dùng password mạnh
- ✅ Enable HTTPS trong production
- ✅ Giới hạn CORS chỉ cho domain cần thiết

## 📞 HỖ TRỢ

Nếu gặp vấn đề, check:
1. Logs của Odoo: `sudo tail -f /var/log/odoo/odoo.log`
2. Console của browser (F12)
3. Network tab để xem API calls

Hoặc chạy test script để debug:
```bash
node scripts/test-odoo-connection.js
```

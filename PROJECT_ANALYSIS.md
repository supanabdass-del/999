# 📊 วิเคราะห์โปรเจค HBZxLRG อย่างละเอียด

## 🏗️ โครงสร้างโปรเจค

```
New folder (3)/
├── 📄 index.html                 # Entry point (redirect ไป dashboard.html)
├── 📄 dashboard.html             # หน้า Dashboard (11 หน้า)
├── 📄 admin.html                 # Admin Panel (จัดการผู้ใช้)
├── 📄 script.js                  # Authentication logic (login/signup)
├── 📄 dashboard.js               # Dashboard main logic (1267 lines)
├── 📄 styles.css                 # Auth page styling
├── 📄 dashboard.css              # Dashboard styling (1142 lines)
├── 📄 README.md                  # Documentation
├── 📄 RUN_INSTRUCTIONS.md        # Setup guide
│
├── 📁 backend/                   # 🖥️ Node.js Express API
│   ├── 📄 index.js               # API Server (574 lines)
│   ├── 📄 database.db            # SQLite database
│   ├── 📄 package.json
│   └── 📁 node_modules/
│
└── 📁 assets/                    # 🖼️ Static files
    ├── panda-logo.png
    └── QR.jpg
```

---

## 📋 ไฟล์หลักและหน้าที่

### 1️⃣ Frontend Authentication
**ไฟล์:** `index.html` + `script.js` + `styles.css`
- **หน้าล็อกอิน:** Username/Password เข้าระบบ
- **หน้าสมัคร:** Username/Email/Password สมัครสมาชิก
- **หน้าลืมรหัส:** Email ส่งอีเมลรีเซ็ต
- **หน้าเปลี่ยนรหัส:** เปลี่ยนรหัสผ่าน
- **Remember Password:** เก็บ username + password ใน localStorage

**API Endpoints ที่ใช้:**
- POST `/api/auth/login` - ล็อกอิน
- POST `/api/auth/signup` - สมัครสมาชิก
- POST `/api/auth/forgot-password` - ลืมรหัส
- POST `/api/auth/change-password` - เปลี่ยนรหัส

### 2️⃣ Dashboard
**ไฟล์:** `dashboard.html` + `dashboard.js` + `dashboard.css`
- **11 หน้า:**
  1. แดชบอร์ด (สถิติ)
  2. เติมเงิน (Top Up)
  3. ซื้อ KEY VIP
  4. เพิ่มเครื่องล็อกอิน (Device)
  5. KEY VIP ของฉัน
  6. ต่ออายุ KEY VIP
  7. ประวัติเติมเงิน
  8. รีเซ็ต UID
  9. ดาวน์โหลด
  10. วิธีใช้งาน
  11. ตั้งค่าโปรไฟล์ (Profile)

**ฟีเจอร์:**
- Sidebar ที่ยุบ/ขยายได้ (70px ยุบ, 280px ขยาย)
- Topbar แสดง Balance ตรงกลาง
- User section ด้านขวาบน
- Mobile responsive

### 3️⃣ Admin Panel
**ไฟล์:** `admin.html`
- จัดการผู้ใช้ (View/Edit/Delete)
- แก้ไขข้อมูล: username, email, password, balance

### 4️⃣ Backend API
**ไฟล์:** `backend/index.js`
- **Port:** 3000
- **Database:** SQLite (database.db)
- **4 Tables:**
  1. `users` - ผู้ใช้งาน
  2. `keys` - VIP KEY
  3. `devices` - เครื่องที่ล็อกอิน
  4. `transactions` - ประวัติการใช้

**15+ API Endpoints:**
- Auth: login, signup, forgot-password, change-password
- Admin: GET/PUT/DELETE users
- Keys: CRUD operations
- Devices: CRUD operations
- Transactions: CRUD operations

---

## 🗄️ Database Schema

### users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  password TEXT (hashed with bcrypt),
  balance REAL,
  created_at TIMESTAMP
)
```

### keys Table
```sql
CREATE TABLE keys (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  key_code TEXT UNIQUE,
  status TEXT (active/expired),
  expiry_date DATE,
  created_at TIMESTAMP
)
```

### devices Table
```sql
CREATE TABLE devices (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  device_name TEXT,
  device_id TEXT,
  added_date DATE
)
```

### transactions Table
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  type TEXT (topup/purchase/renewal),
  amount REAL,
  timestamp TIMESTAMP
)
```

---

## 🔐 Authentication Flow

### Login/Signup
```
1. User ป้อน username/password ใน Frontend
2. Frontend เรียก API Backend
3. Backend ตรวจสอบ + hash password
4. Backend ส่ง JWT token กลับ
5. Frontend เก็บ token + userData ใน localStorage
6. Redirect ไปหน้า Dashboard
```

### Data Storage
```
localStorage:
- isLoggedIn: 'true'
- authToken: 'JWT_TOKEN_HERE'
- username: 'user123'
- userId: '1'
- userData: {
    username: 'user123',
    email: 'user@example.com',
    balance: 500,
    keys: [...],
    devices: [...],
    transactions: [...]
  }
```

---

## 🔄 Current Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Vanilla JavaScript, HTML5, CSS3 |
| Backend | Node.js, Express.js |
| Database | SQLite3 |
| Auth | JWT, bcryptjs |
| Icons | Font Awesome 6.4.0 |
| Ports | Frontend: 8000, Backend: 3000 |

---

## ✨ Features

✅ Authentication (Login/Signup/Forgot/Change)
✅ JWT Token based session
✅ Remember password (username + password storage)
✅ Dashboard with 11 pages
✅ Admin panel for user management
✅ VIP KEY management
✅ Device management
✅ Transaction history
✅ Responsive sidebar
✅ User profile settings
✅ Balance display
✅ Modal notifications (Loading/Success/Error)

---

## 🚀 Deployment Ready

✅ Backend listen on `0.0.0.0:3000`
✅ Can run on VPS with IP configuration
✅ SQLite database (portable)
✅ No external dependencies (except npm packages)

---

## 📝 ไฟล์ขนาด

| ไฟล์ | ขนาด | หมายเหตุ |
|---|---|---|
| dashboard.js | 1,267 lines | Main dashboard logic |
| backend/index.js | 574 lines | API server |
| dashboard.css | 1,142 lines | Dashboard styling |
| dashboard.html | 776 lines | 11-page dashboard |
| script.js | 323 lines | Auth logic |
| styles.css | Large | Auth page styling |


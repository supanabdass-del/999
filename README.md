# HBZxLRG - Authentication & Dashboard System

## 📁 โครงสร้างโปรเจค

```
HBZxLRG/
├── index.html                     # Entry point → redirect ไปยัง auth/app.html
├── README.md                       # Documentation
├── .vscode/
│   └── settings.json
│
└── auth/                           # 🔐 Authentication Web Application
    ├── app.html                    # หน้า Login/Signup/Forgot Password/Change Password
    ├── script.js                   # Utility functions (togglePassword, showMessage, showPage)
    ├── dashboard.js                # Main logic (form handlers, redirect)
    ├── styles.css                  # Auth pages styling
    ├── dashboard.css               # Dashboard pages styling
    ├── panda-logo.png              # Logo
    ├── QR.jpg                       # QR Code image
    │
    └── pages/
        └── dashboard.html          # 📊 Dashboard (9 pages)
```

## 🚀 วิธีเริ่มต้น

### ใช้ Python HTTP Server
```bash
python -m http.server 8000
# เปิด http://localhost:8000
```

### ใช้ Live Server (VS Code)
1. คลิกขวาที่ `index.html`
2. เลือก "Open with Live Server"

### ใช้ Node.js
```bash
npx http-server
```

## 📄 ไฟล์หลัก

### `auth/app.html` - หน้าเข้าสู่ระบบ
- **4 หน้า:** Login | Signup | Forgot Password | Change Password
- ไม่ต้องกรอกข้อมูล สามารถกดเข้าได้ทันที
- Redirect ไปหน้า Dashboard หลังเข้า 1.5 วิ
- In-page notifications (ไม่ใช้ browser alert)

### `auth/pages/dashboard.html` - แดชบอร์ด
- **9 หน้าหลัก:**
  1. Dashboard Main - สถิติและประวัติ
  2. Top-up - เติมเงิน
  3. Buy KEY VIP - ซื้อ KEY
  4. Buy Device - เพิ่มเครื่อง
  5. My Keys - ดูคีย์ทั้งหมด
  6. Renew Key - ต่ออายุ KEY
  7. Top-up History - ประวัติ
  8. Reset UID - รีเซ็ต UID
  9. Profile Settings - ตั้งค่า

## 🔐 การไหลของระบบ

```
index.html → auth/app.html (login)
Login ✓ → auth/pages/dashboard.html (1.5s delay)
Logout → auth/app.html (back to login)
```

## 🎨 สี

- **Primary**: `#00d084` (Green)
- **Featured**: `#ff6b5b` (Orange-Red)
- **Background**: Dark theme

## 🛠️ Technologies

- HTML5, CSS3, Vanilla JavaScript
- Font Awesome 6.4.0 (CDN)
- LocalStorage for data
- UTF-8 encoding (Thai support)

---

**Version**: 1.0 | **Last Updated**: Nov 2025

- ช่องกรอก: ชื่อผู้ใช้, อีเมล, รหัสผ่าน, ยืนยันรหัสผ่าน
- ฟีเจอร์:
  - ตรวจสอบรหัสผ่านตรงกัน
  - ยอมรับข้อกำหนดการใช้งาน
  - Validation
- ลิงก์: กลับไปล็อกอิน

### 3. **Forgot Password Page** (หน้าลืมรหัสผ่าน)
- ช่องกรอก: อีเมล
- ฟีเจอร์: ส่งลิงก์รีเซ็ตรหัสผ่าน
- ลิงก์: กลับไปล็อกอิน

## 🎯 Design Highlights

✅ **Dark Theme** - สีเขียว (#00d084) ในพื้นหลังสีดำ  
✅ **Responsive Design** - ใช้ได้ดีบนมือถือและ Desktop  
✅ **Smooth Animations** - Fade-in effects และ transitions  
✅ **Font Awesome Icons** - ปุ่มดูรหัสผ่านที่สวยงาม  
✅ **LocalStorage** - เก็บข้อมูลผู้ใช้ในเบราว์เซอร์  
✅ **Compact Layout** - ฟอร์มกระชับและปลอดภัย

## 📝 Validation Rules

- ชื่อผู้ใช้: ต้องกรอก
- อีเมล: ต้องกรอก + ต้องเป็นรูปแบบอีเมล
- รหัสผ่าน: ต้องมีอย่างน้อย 6 ตัวอักษร
- ยืนยันรหัสผ่าน: ต้องตรงกับรหัสผ่าน
- ข้อกำหนด: ต้องยอมรับ

## 🔐 Security Notes

⚠️ **หมายเหตุ**: โปรเจคนี้ใช้ localStorage เพื่อการสาธิตเท่านั้น  
ในระบบจริง ควรใช้:
- Backend API สำหรับ authentication
- Password hashing (เช่น bcrypt)
- HTTPS encryption
- Session management

## 📋 ไฟล์ที่รวมแล้ว

- `auth/` - ที่เดียวสำหรับทั้ง Auth Project
- CSS รวมอยู่ใน `styles.css` เดียว
- JavaScript รวมอยู่ใน `script.js` เดียว
- ไม่มี `index.css` แยก (ลบแล้ว)

---

**โปรเจค**: HBZxLRG - Authentication Website  
**สร้างโดย**: AI Assistant  
**สุดท้ายแก้ไข**: November 2025

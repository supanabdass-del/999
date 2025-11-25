## 🚀 วิธีรันระบบ HBZxLRG (Google Apps Script Version)

### 📋 ขั้นตอนการตั้งค่า:

#### 1️⃣ **สร้าง Google Sheet**
- ไปที่ https://sheets.google.com
- สร้าง Sheet ใหม่ชื่อ `Users`
- เพิ่ม Headers ในแถวแรก:
  ```
  A: ID
  B: Username
  C: Email
  D: Password_Hash
  E: Created_At
  F: Updated_At
  G: Is_Banned
  H: Auth_Token
  I: Token_Expiry
  J: Reset_Token
  K: Reset_Token_Expiry
  ```
- **คัดลอก Sheet ID** จาก URL (ส่วน `{SHEET_ID}` ใน URL)

---

#### 2️⃣ **สร้าง Google Apps Script Project**
- ไปที่ https://script.google.com
- สร้าง Project ใหม่
- คัดลอก Code ทั้งหมดจากไฟล์ `APPS_SCRIPT_CODE.gs`
- วางลงใน Apps Script Editor
- **ตั้งค่า Configuration** (บรรทัด 7-9):
  ```javascript
  const SHEET_ID = "YOUR_GOOGLE_SHEET_ID";       // ใส่ Sheet ID ที่คัดลอก
  const JWT_SECRET = "your-secret-key-here";    // ตั้งรหัสสำคัญที่แข็งแกร่ง
  const ADMIN_PASSWORD = "admin@123";            // เปลี่ยนรหัสผ่าน Admin
  ```

---

#### 3️⃣ **Deploy Web App**
- คลิก **Deploy** → **New deployment**
- เลือก **Type**: Web app
- **Execute as**: Your Google Account
- **Who has access**: Anyone
- คลิก **Deploy**
- **คัดลอก Deployment URL** (รูปแบบ: `https://script.google.com/macros/d/{SCRIPT_ID}/userweb`)

---

#### 4️⃣ **ตั้งค่า Frontend**
- เปิดไฟล์ `config.js`
- แก้ไขบรรทัด 3:
  ```javascript
  const APPS_SCRIPT_URL = "https://script.google.com/macros/d/{SCRIPT_ID}/userweb";
  ```
- ใส่ Deployment URL ที่คัดลอกในขั้นตอน 3

---

### 🌐 เข้าใช้งาน:

เปิดไฟล์เหล่านี้ใน Browser:

| URL | ลักษณะ |
|-----|--------|
| `index.html` | 🔐 หน้า Login/Signup |
| `dashboard.html` | 📊 Dashboard (หลังจากล็อกอิน) |
| `admin.html` | 🔧 Admin Panel (จัดการ users) |

---

### 🔐 การทดสอบ:

1. เปิด `index.html` ใน Browser
2. **สมัครสมาชิก** ด้วยข้อมูล:
   - ชื่อผู้ใช้: `testuser`
   - อีเมล: `test@example.com`
   - รหัสผ่าน: `123456`
3. **ล็อกอิน** ด้วยข้อมูลที่สมัครไป
4. ดูข้อมูลใน Dashboard
5. เปิด `admin.html` เพื่อจัดการ users (ใส่ Admin Password)

---

### 📂 โครงสร้างโปรเจค (ปัจจุบัน):

```
New folder (3)/
├── assets/                    (ภาพ: panda-logo.png, QR.jpg)
├── index.html                (Login page)
├── dashboard.html            (Dashboard page)
├── admin.html                (Admin Panel)
├── script.js                 (Login & Auth logic)
├── dashboard.js              (Dashboard logic)
├── config.js                 (Apps Script API wrapper)
├── styles.css                (Auth styling)
├── dashboard.css             (Dashboard styling)
├── APPS_SCRIPT_CODE.gs       (Apps Script Source code)
├── APPS_SCRIPT_DEPLOYMENT.md (Deployment guide)
├── PROJECT_ANALYSIS.md       (Project documentation)
├── GOOGLE_SHEET_AUTH_DESIGN.md (Design specs)
└── README.md
```

---

### ✅ ข้อดีของ Apps Script:

- ✅ **ไม่ต้องรัน Backend Server** - ใช้ Google Cloud ฟรี
- ✅ **ไม่ต้อง Database** - ใช้ Google Sheet
- ✅ **Auto Scaling** - เซิร์ฟเวอร์โดย Google
- ✅ **Secure** - ใช้ JWT tokens
- ✅ **Easy Deployment** - Deploy ด้วยคลิก
- ✅ **Real-time Updates** - ข้อมูลปรากฎในทันที

---

### 🆘 Troubleshooting:

**ปัญหา:** "Not authorized to access this resource"
- ตรวจสอบ Apps Script Deployment URL ใน `config.js`
- ตรวจสอบว่าเลือก **"Anyone"** เมื่อ Deploy

**ปัญหา:** "Sheet not found"
- ตรวจสอบชื่อ Sheet ต้องเป็น `Users` (ตัวพิมพ์ใหญ่)
- ตรวจสอบ SHEET_ID ใน Apps Script Code.gs

**ปัญหา:** Login ไม่สำเร็จ
- ตรวจสอบ Browser Console (F12) สำหรับ Error
- ตรวจสอบ Apps Script Execution logs

**ปัญหา:** Email Notifications ไม่ได้รับ
- ตรวจสอบ Gmail API ใน Google Cloud Console
- ตรวจสอบที่อยู่อีเมล

---

### 📖 ข้อมูลเพิ่มเติม:

- ดูไฟล์ `APPS_SCRIPT_DEPLOYMENT.md` สำหรับ detailed guide
- ดูไฟล์ `PROJECT_ANALYSIS.md` สำหรับ project overview
- ดูไฟล์ `GOOGLE_SHEET_AUTH_DESIGN.md` สำหรับ database schema

---

### 🔐 ความปลอดภัย:

1. **เปลี่ยน Admin Password** จากค่าเริ่มต้นใน Apps Script
2. **ใช้ Strong JWT_SECRET** (อย่างน้อย 32 ตัวอักษร)
3. **จำกัดการเข้าถึง Sheet** - แบ่งปันเฉพาะกับผู้ใช้ที่เชื่อถือได้
4. **เปิด 2FA** บนบัญชี Google
5. **ตรวจสอบ Sheet regularly** เพื่อหาการแก้ไขที่ไม่อนุญาต

---

**ปรับปรุงครั้งสุดท้าย**: 2024
**เวอร์ชั่น**: 2.0 (Google Apps Script)


---

📞 **ติดต่อ:** ถ้ามีปัญหาอื่นๆ สอบถามได้เลย! 😊

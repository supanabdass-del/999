# 🔐 ออกแบบ Google Sheet สำหรับระบบล็อกอิน (Apps Script)

## 📊 Google Sheet Structure

### Sheet 1: "Users" - ข้อมูลผู้ใช้

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| **ID** | **Username** | **Email** | **Password (Hashed)** | **Status** | **Created Date** | **Last Login** | **Token** |
| 1 | user001 | user001@email.com | $2b$10$hash...1 | active | 2025-01-15 | 2025-01-25 | jwt_token_1... |
| 2 | admin123 | admin@email.com | $2b$10$hash...2 | active | 2025-01-10 | 2025-01-25 | jwt_token_2... |
| 3 | test_user | test@email.com | $2b$10$hash...3 | inactive | 2025-01-20 | - | - |

**รายละเอียดคอลัมน์:**
- **A (ID):** Auto increment หรือ UUID
- **B (Username):** ชื่อผู้ใช้ (unique, 4-20 characters)
- **C (Email):** อีเมล (unique, valid format)
- **D (Password):** Hashed password (bcrypt)
- **E (Status):** active / inactive / banned
- **F (Created Date):** วันที่สร้าง account
- **G (Last Login):** วันล็อกอินครั้งล่าสุด
- **H (Token):** JWT token (expires in 7 days)

---

### Sheet 2: "PasswordResets" - การขอรีเซ็ตรหัส

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| **ID** | **Username** | **Email** | **Reset Token** | **Created** | **Expiry** |
| 1 | user001 | user001@email.com | reset_token_xyz... | 2025-01-25 10:30 | 2025-01-25 11:30 |
| 2 | test_user | test@email.com | reset_token_abc... | 2025-01-25 14:15 | 2025-01-25 15:15 |

**รายละเอียดคอลัมน์:**
- **A (ID):** Auto increment
- **B (Username):** ชื่อผู้ใช้
- **C (Email):** อีเมลที่ลืมรหัส
- **D (Reset Token):** Token สำหรับ reset (unique)
- **E (Created):** เวลาสร้าง request
- **F (Expiry):** เวลา expire (1 ชั่วโมง)

---

### Sheet 3: "ChangePasswordLog" - บันทึกการเปลี่ยนรหัส

| A | B | C | D | E |
|---|---|---|---|---|
| **ID** | **Username** | **Old Password (Hash)** | **New Password (Hash)** | **Changed Date** |
| 1 | user001 | $2b$10$old... | $2b$10$new... | 2025-01-25 10:45 |
| 2 | admin123 | $2b$10$old... | $2b$10$new... | 2025-01-24 15:30 |

**รายละเอียดคอลัมน์:**
- **A (ID):** Auto increment
- **B (Username):** ชื่อผู้ใช้
- **C (Old Password Hash):** รหัสเดิม (สำหรับบันทึก)
- **D (New Password Hash):** รหัสใหม่
- **E (Changed Date):** วันที่เปลี่ยน

---

### Sheet 4: "AuditLog" - บันทึกการใช้งาน

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| **ID** | **Username** | **Action** | **Details** | **IP Address** | **Timestamp** |
| 1 | user001 | login | Login successful | 192.168.1.100 | 2025-01-25 09:30 |
| 2 | user001 | signup | New account created | 192.168.1.100 | 2025-01-15 14:20 |
| 3 | test_user | forgot_password | Reset request sent | 192.168.1.101 | 2025-01-25 10:15 |
| 4 | admin123 | change_password | Password changed | 192.168.1.102 | 2025-01-24 15:30 |
| 5 | user001 | failed_login | Wrong password | 192.168.1.103 | 2025-01-25 11:00 |

**รายละเอียดคอลัมน์:**
- **A (ID):** Auto increment
- **B (Username):** ชื่อผู้ใช้
- **C (Action):** login / signup / forgot_password / change_password / failed_login / logout
- **D (Details):** รายละเอียดเพิ่มเติม
- **E (IP Address):** IP ที่ทำการ
- **F (Timestamp):** เวลาที่ทำการ

---

## 🔧 Apps Script Functions

```javascript
// ==================== AUTHENTICATION ====================

// 1. SIGNUP - สมัครสมาชิก
function handleSignup(username, email, password, confirmPassword) {
  // ตรวจสอบ input
  // Hash password ด้วย bcryptjs
  // เพิ่มลง Sheet "Users"
  // บันทึก audit log
  // ส่ง JWT token
}

// 2. LOGIN - ล็อกอิน
function handleLogin(username, password) {
  // ค้นหา username ใน Sheet "Users"
  // ตรวจสอบ password กับ hash
  // สร้าง JWT token
  // Update "Last Login" และ "Token"
  // บันทึก audit log
  // ส่ง token กลับ
}

// 3. FORGOT PASSWORD - ลืมรหัส
function handleForgotPassword(email) {
  // ค้นหา email ใน Sheet "Users"
  // สร้าง reset token
  // เพิ่มลง Sheet "PasswordResets"
  // ส่ง email ที่มี reset link
  // บันทึก audit log
}

// 4. RESET PASSWORD - รีเซ็ตรหัส
function handleResetPassword(resetToken, newPassword) {
  // ค้นหา reset token ใน Sheet "PasswordResets"
  // ตรวจสอบ expiry time
  // Hash password ใหม่
  // Update Sheet "Users"
  // ลบ reset token
  // บันทึก log
}

// 5. CHANGE PASSWORD - เปลี่ยนรหัส
function handleChangePassword(username, oldPassword, newPassword) {
  // ค้นหา username
  // ตรวจสอบ oldPassword
  // Hash newPassword
  // Update Sheet "Users"
  // บันทึก ChangePasswordLog
  // บันทึก audit log
}

// ==================== UTILITY ====================

// Hash Password
function hashPassword(password) {
  // ใช้ Utilities.computeDigest หรือ CryptoJS
}

// Verify Password
function verifyPassword(password, hash) {
  // เปรียบเทียบ password กับ hash
}

// Generate JWT Token
function generateJWT(username, userId) {
  // สร้าง JWT token
  // Set expiry 7 days
}

// Verify JWT Token
function verifyJWT(token) {
  // ตรวจสอบ token
  // Return username ถ้า valid
}

// Generate Reset Token
function generateResetToken() {
  // สร้าง unique token
}

// Clean Expired Reset Tokens
function cleanExpiredTokens() {
  // ลบ reset token ที่ expire แล้ว
  // รัน scheduled trigger ทุก 1 ชั่วโมง
}
```

---

## 🌐 API Endpoints (via Apps Script Web App)

```
POST /signup
Body: {
  username: "user123",
  email: "user@example.com",
  password: "Pass@123",
  confirmPassword: "Pass@123"
}
Response: {
  success: true,
  token: "jwt_token...",
  userId: 1,
  message: "สมัครสมาชิกสำเร็จ"
}

POST /login
Body: {
  username: "user123",
  password: "Pass@123"
}
Response: {
  success: true,
  token: "jwt_token...",
  userId: 1,
  username: "user123",
  email: "user@example.com"
}

POST /forgot-password
Body: {
  email: "user@example.com"
}
Response: {
  success: true,
  message: "ส่ง link รีเซ็ตรหัสไปที่อีเมล"
}

POST /reset-password
Body: {
  resetToken: "reset_token_xyz...",
  newPassword: "NewPass@123"
}
Response: {
  success: true,
  message: "เปลี่ยนรหัสผ่านสำเร็จ"
}

POST /change-password
Headers: Authorization: Bearer {token}
Body: {
  oldPassword: "OldPass@123",
  newPassword: "NewPass@123"
}
Response: {
  success: true,
  message: "เปลี่ยนรหัสผ่านสำเร็จ"
}
```

---

## 📋 Data Validation Rules

### Username
- ❌ ต้อง unique
- ❌ ความยาว 4-20 characters
- ❌ เฉพาะ alphanumeric + underscore
- ❌ ต้องขึ้นต้นด้วยตัวอักษร

### Email
- ❌ ต้อง unique
- ❌ Valid email format (user@domain.com)
- ❌ ตรวจสอบ domain ว่า valid

### Password
- ❌ ความยาวอย่างน้อย 8 characters
- ❌ ต้องมี uppercase + lowercase
- ❌ ต้องมี number
- ❌ ต้องมี special character (!@#$%^&*)

---

## 🔒 Security Measures

✅ Hash password ด้วย bcryptjs
✅ JWT token with 7-day expiry
✅ Reset token expires in 1 hour
✅ Audit log ทุกการใช้งาน
✅ IP address tracking
✅ Failed login attempt logging
✅ Rate limiting (3 ครั้ง ต่อ 5 นาที)
✅ Session management
✅ HTTPS only (on production)

---

## 📝 การใช้งาน

### Setup
1. สร้าง Google Sheet ใหม่
2. สร้าง 4 Sheets ตามที่ออกแบบ
3. เพิ่ม headers ตามตาราข้างบน
4. เชื่อมต่อ Apps Script

### Deploy as Web App
```
Apps Script → Deploy → New deployment
Type: Web app
Execute as: Your email
Who has access: Anyone
Get URL
```

### Frontend Integration
```javascript
const API_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL";

async function login(username, password) {
  const response = await fetch(`${API_URL}?action=login`, {
    method: 'POST',
    payload: JSON.stringify({
      username: username,
      password: password
    })
  });
  return response.json();
}
```


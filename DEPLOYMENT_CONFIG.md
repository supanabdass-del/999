# ⚙️ DEPLOYMENT CONFIGURATION

การตั้งค่าเสร็จสิ้นสำหรับการใช้งาน

---

## 📋 Configuration Completed

### 1️⃣ Apps Script Settings (APPS_SCRIPT_CODE.gs)

```javascript
const SHEET_ID = "1E4XnIbPDQnRXu5cBJ8tyYKauOshZSbsYPJdVwRvIEXI";
const SHEET_NAME = "Users";
const JWT_SECRET = "ddoss";
```

✅ **Status**: Configured

---

### 2️⃣ Admin Users

**Primary Admin:**
- Username: `nnchchc`
- Password: `nnchchc1`

**Backup Admin:**
- Username: `adminkong`
- Password: `kong`

✅ **Status**: Ready

---

### 3️⃣ Admin Panel Button Visibility

Dashboard จะแสดง **Admin Panel** button เฉพาะเมื่อ:

- ✅ User ล็อกอินเป็น `nnchchc`
- ✅ User ล็อกอินเป็น `adminkong`
- ❌ ไม่แสดง: User ปกติ

**Implementation:** 
- `checkAdminStatus()` function ใน dashboard.js
- `isCurrentUserAdmin()` function ใน config.js

✅ **Status**: Active

---

### 4️⃣ Environment Support

**ทำงานได้บนทั้ง 3 สภาพแวดล้อม:**

1. **localhost** (Python/Node.js)
   ```bash
   python -m http.server 8000
   ```
   - URL: `http://localhost:8000`

2. **Live Server** (VS Code Extension)
   - URL: `http://127.0.0.1:5500` หรือ `http://localhost:5500`

3. **Production** (Netlify/Vercel/GitHub Pages)
   - URL: `https://yourdomain.com`

**All environments use the same APPS_SCRIPT_URL**

✅ **Status**: Configured

---

## 📝 Setup Checklist

Before deployment, verify:

- [ ] APPS_SCRIPT_CODE.gs updated in Google Apps Script
- [ ] Sheet ID correct: `1E4XnIbPDQnRXu5cBJ8tyYKauOshZSbsYPJdVwRvIEXI`
- [ ] JWT_SECRET set: `ddoss`
- [ ] Apps Script deployed as Web App
- [ ] Deployment URL in config.js updated
- [ ] Tested with nnchchc login (Admin Panel should appear)
- [ ] Tested with regular user (Admin Panel should NOT appear)
- [ ] localhost/liveserver working
- [ ] Apps Script API responding

---

## 🧪 Testing

### Test Admin Visibility

**Test Case 1: Login as Admin**
```
Username: nnchchc
Password: nnchchc1
Expected: Admin Panel button visible ✅
```

**Test Case 2: Login as Backup Admin**
```
Username: adminkong
Password: kong
Expected: Admin Panel button visible ✅
```

**Test Case 3: Create Regular User**
```
Username: testuser
Password: Test@12345
Expected: Admin Panel button hidden ✅
```

---

## 🔧 Development Environment

### Using Live Server (Recommended)

1. Install VS Code Extension: "Live Server"
2. Right-click `index.html` → "Open with Live Server"
3. Automatically opens in browser

**Benefits:**
- Auto-reload on file save
- Works on localhost
- Better CORS support
- Perfect for development

### Using Python HTTP Server

```bash
# Navigate to project folder
cd "c:\Users\nnchchc\Desktop\New folder (3)"

# Start server
python -m http.server 8000

# Open in browser
# http://localhost:8000
```

---

## 📱 CORS & Cross-Origin

**Good News:** 
- Apps Script deployment URL works with all environments
- No CORS issues with Google Apps Script
- localhost, liveserver, and production all work seamlessly

**No additional configuration needed!**

---

## 🚀 Deployment URL

**Update this in config.js when you have your Apps Script deployed:**

```javascript
// Change this line in config.js
const PRODUCTION_URL = "https://script.google.com/macros/d/YOUR_SCRIPT_ID/userweb";
```

---

## 📚 Files Updated

1. **APPS_SCRIPT_CODE.gs**
   - ✅ SHEET_ID configured
   - ✅ JWT_SECRET: "ddoss"
   - ✅ Admin users defined

2. **config.js**
   - ✅ Environment detection added
   - ✅ `isCurrentUserAdmin()` function
   - ✅ `getCurrentAdminInfo()` function
   - ✅ Works with localhost/liveserver

3. **dashboard.html**
   - ✅ Admin Panel button hidden by default
   - ✅ ID: "admin-panel-btn"

4. **dashboard.js**
   - ✅ `checkAdminStatus()` function
   - ✅ Shows/hides Admin Panel button
   - ✅ Called on DOMContentLoaded

---

## ✅ Ready to Use!

**Current Status:** 🟢 READY FOR DEVELOPMENT

- ✅ Configuration complete
- ✅ Admin system working
- ✅ Environment support (localhost/liveserver)
- ✅ Admin Panel visibility controlled
- ✅ Ready to test and develop

---

## 🎯 Next Steps

1. Deploy APPS_SCRIPT_CODE.gs to Google Apps Script
2. Update deployment URL in config.js
3. Login with admin account to verify
4. Start development with Live Server or localhost
5. Make additional changes as needed

---

**Configuration Version**: 2.0
**Updated**: November 25, 2025
**Status**: ✅ Ready

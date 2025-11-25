# 🔐 Admin Users Configuration

บัญชี Admin ขนาดใหญ่ของระบบ HBZxLRG

---

## 📋 Admin Users

### 1️⃣ Primary Admin
**Username**: `nnchchc`
**Password**: `nnchchc1`
**Role**: Primary Admin
**Status**: Active

### 2️⃣ Backup Admin
**Username**: `adminkong`
**Password**: `kong`
**Role**: Backup Admin
**Status**: Active

---

## 🔒 Security Notes

- ✅ Credentials stored in `APPS_SCRIPT_CODE.gs` (lines 11-14)
- ✅ Each admin user has unique username and password
- ✅ Admin functions require both username and password
- ⚠️ Change passwords periodically for security
- ⚠️ Do not share these credentials with unauthorized users

---

## 🔄 How to Change Admin Credentials

### To Change Admin Username/Password:

1. **Open Google Apps Script** (script.google.com)
2. **Find ADMIN_USERS array** (around line 11-14):
   ```javascript
   const ADMIN_USERS = [
     { username: "nnchchc", password: "nnchchc1", role: "primary" },
     { username: "adminkong", password: "kong", role: "backup" }
   ];
   ```

3. **Update desired user**:
   ```javascript
   // Example: Change primary admin password
   { username: "nnchchc", password: "NewPassword123", role: "primary" }
   ```

4. **Save and Deploy**:
   - Press Ctrl+S to save
   - Click Deploy → Manage Deployments
   - Update the deployment

---

## 🔑 Features Available for Admin

### User Management
- ✅ View all users
- ✅ Edit user information (username, email, balance)
- ✅ Delete users
- ✅ Ban users (block access)
- ✅ Unban users (restore access)

### Account Management
- ✅ Reset user passwords
- ✅ Reissue authentication tokens
- ✅ Export user data as CSV

### Admin Panel
- 📊 Dashboard with user statistics
- 👥 User list with search & filter
- ✏️ Edit user modal
- 📥 CSV export functionality

---

## 🌐 Accessing Admin Panel

1. **Open admin.html** in browser
2. **Enter Admin Username**: (nnchchc or adminkong)
3. **Enter Admin Password**: (matching password)
4. **Admin dashboard** loads with all functions

---

## 📝 First-Time Setup

**Don't forget to:**

1. ✅ Change admin passwords from defaults
2. ✅ Update `ADMIN_USERS` array in Apps Script
3. ✅ Deploy Apps Script
4. ✅ Test with new credentials

---

## 🧪 Testing Admin Functions

### Test with Primary Admin:
```
Username: nnchchc
Password: nnchchc1
```

### Test with Backup Admin:
```
Username: adminkong
Password: kong
```

---

## 🔗 Related Files

- **APPS_SCRIPT_CODE.gs** - Admin verification function
- **config.js** - Admin API wrappers
- **admin.html** - Admin panel interface

---

## ⚠️ Important

- Admin credentials are NOT the same as user accounts
- Admin users are defined in `ADMIN_USERS` array only
- Regular users are stored in Google Sheet
- Admin functions require BOTH username AND password

---

**Version**: 2.0
**Updated**: 2024
**Status**: Active ✅

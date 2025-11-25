# 🔧 CONFIGURATION REFERENCE CARD

Quick reference for all configuration values needed for Apps Script deployment.

---

## 📋 Configuration Checklist

### ✅ Step 1: Google Sheet Setup

**Create a new Google Sheet:**

```
Sheet Name: Users
Location: Google Drive
URL Format: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
```

**Add these 11 columns to row 1:**

| Column | Header | Type | Notes |
|--------|--------|------|-------|
| A | ID | Number | Auto-increment |
| B | Username | Text | Unique identifier |
| C | Email | Text | Email address |
| D | Password_Hash | Text | Hashed password |
| E | Created_At | Date | Account creation |
| F | Updated_At | Date | Last update |
| G | Is_Banned | Boolean | Ban status |
| H | Auth_Token | Text | JWT token |
| I | Token_Expiry | Date | Token expiry |
| J | Reset_Token | Text | Reset token |
| K | Reset_Token_Expiry | Date | Reset expiry |

**📌 SAVE THIS VALUE:**
```
YOUR_SHEET_ID = (copy from URL between /d/ and /edit)
```

---

### ✅ Step 2: Google Apps Script Setup

**Create a new Apps Script project:**

```
Project Name: HBZxLRG Auth
URL: https://script.google.com
```

**Copy APPS_SCRIPT_CODE.gs to Apps Script editor:**

File location in project:
```
/APPS_SCRIPT_CODE.gs
```

**Configure these 3 values (Lines 7-9 in Code.gs):**

```javascript
// Line 7: Your Google Sheet ID
const SHEET_ID = "YOUR_SHEET_ID";

// Line 8: Secret key for JWT (at least 32 characters, random)
const JWT_SECRET = "your-secret-key-here";
// Example: "aK7#mP9$xL2@qW5&vZ8*jY3^hN4!bC6Q"

// Line 9: Admin panel password (change from default!)
const ADMIN_PASSWORD = "admin@123";
// Example: "SecureAdminPass2024!"
```

**📌 SAVE THESE VALUES:**
```
YOUR_JWT_SECRET = (32+ random characters)
YOUR_ADMIN_PASSWORD = (strong password)
```

---

### ✅ Step 3: Deploy Apps Script Web App

**In Apps Script Editor:**

1. Click **Deploy** button
2. Click **New deployment**
3. Set:
   - **Type**: Web app
   - **Execute as**: Your Google Account
   - **Who has access**: Anyone
4. Click **Deploy**
5. Copy the generated URL

**Deployment URL Format:**
```
https://script.google.com/macros/d/{SCRIPT_ID}/userweb
```

**📌 SAVE THIS VALUE:**
```
APPS_SCRIPT_URL = (the full deployment URL)
```

**Example:**
```
https://script.google.com/macros/d/1a2b3c4d5e6f7g8h9i0j/userweb
```

---

### ✅ Step 4: Update Frontend Configuration

**File: config.js (Line 6)**

```javascript
const APPS_SCRIPT_URL = "https://script.google.com/macros/d/YOUR_SCRIPT_ID/userweb";
```

Replace with your deployment URL from Step 3.

**Example:**
```javascript
const APPS_SCRIPT_URL = "https://script.google.com/macros/d/1a2b3c4d5e6f7g8h9i0j/userweb";
```

---

## 📌 Configuration Summary Table

### What to Update Where

| Setting | File | Line | Type | Example |
|---------|------|------|------|---------|
| SHEET_ID | APPS_SCRIPT_CODE.gs | 7 | String | `1a2b3c4d5e6f7g8h9i0j` |
| JWT_SECRET | APPS_SCRIPT_CODE.gs | 8 | String | `aK7#mP9$xL2@qW5&vZ8*jY3^hN4!bC6Q` |
| ADMIN_PASSWORD | APPS_SCRIPT_CODE.gs | 9 | String | `SecureAdminPass2024!` |
| APPS_SCRIPT_URL | config.js | 6 | String | `https://script.google.com/macros/d/.../userweb` |

---

## 🔑 Security Recommendations

### JWT_SECRET Best Practices:
- ✅ At least 32 characters long
- ✅ Mix of uppercase, lowercase, numbers, symbols
- ✅ Random and unique
- ✅ Not used elsewhere
- ✅ Change every 6 months

**How to Generate:**
```
Option 1: Use an online random string generator
Option 2: Use password manager to generate
Option 3: Bash: head -c 32 /dev/urandom | base64
Option 4: Node.js: require('crypto').randomBytes(32).toString('hex')
```

### ADMIN_PASSWORD Best Practices:
- ✅ Strong password (12+ characters)
- ✅ Mix of uppercase, lowercase, numbers, symbols
- ✅ Not related to username
- ✅ Don't share with anyone
- ✅ Change periodically

**Examples of Strong Passwords:**
```
❌ "admin123" - Too weak
❌ "password" - Common
✅ "SecureAdminPass2024!" - Strong
✅ "Admin@#$2024XYZ" - Strong
✅ "HBZ-xLRG-Admin-Key-2024" - Strong
```

---

## 🧪 Testing Configuration

### Test Credentials (After Deployment):

1. **First Admin Access:**
   - Password: (your ADMIN_PASSWORD from Step 2)
   - URL: `admin.html`

2. **Test User Account:**
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test@123456`

3. **Verify in Google Sheet:**
   - Check "Users" sheet for new entries
   - Verify hashed passwords stored
   - Check JWT tokens generated

---

## 🔄 Configuration Checklist (Printable)

```
STEP 1: GOOGLE SHEET
[ ] Created new Google Sheet
[ ] Named it "Users"
[ ] Added 11 column headers
[ ] Copied Sheet ID: ___________________

STEP 2: APPS SCRIPT
[ ] Created new Apps Script project
[ ] Pasted APPS_SCRIPT_CODE.gs content
[ ] Updated SHEET_ID (line 7)
[ ] Updated JWT_SECRET (line 8): ___________________
[ ] Updated ADMIN_PASSWORD (line 9): ___________________
[ ] Verified all 3 values in Code.gs

STEP 3: DEPLOY
[ ] Deployed as Web app
[ ] Set "Execute as": Your Account
[ ] Set "Who has access": Anyone
[ ] Copied deployment URL: ___________________
[ ] Tested web app endpoint

STEP 4: FRONTEND CONFIG
[ ] Opened config.js
[ ] Updated APPS_SCRIPT_URL (line 6)
[ ] Saved config.js
[ ] Verified no errors in console

STEP 5: TEST
[ ] Opened index.html
[ ] Created test account (signup)
[ ] Logged in successfully
[ ] Checked data in Google Sheet
[ ] Opened admin.html
[ ] Entered ADMIN_PASSWORD
[ ] Viewed all users
[ ] Tested user edit
[ ] Tested user delete
```

---

## 🆘 Troubleshooting Configuration Issues

### Issue: "CORS Error" or "Network Error"

**Check:**
1. Is APPS_SCRIPT_URL correct in config.js?
2. Did you deploy as "Web app"?
3. Did you select "Anyone" for access?
4. Is URL exactly from deployment (no typos)?

**Fix:**
```javascript
// Make sure this matches your deployment exactly
const APPS_SCRIPT_URL = "https://script.google.com/macros/d/YOUR_ID/userweb";
```

### Issue: "Sheet not found" Error

**Check:**
1. Is SHEET_ID exactly from your Google Sheet URL?
2. Is sheet named exactly "Users" (case-sensitive)?
3. Does Google Account have access to sheet?

**Fix in APPS_SCRIPT_CODE.gs:**
```javascript
// Verify this matches your sheet ID exactly
const SHEET_ID = "YOUR_SHEET_ID";
```

### Issue: Password/Token Errors

**Check:**
1. Is JWT_SECRET the same in all deployments?
2. Have you changed ADMIN_PASSWORD from default?
3. Are you using correct admin password?

**Fix:**
- Change JWT_SECRET to strong value
- Change ADMIN_PASSWORD from "admin@123"

---

## 📱 Local Testing URLs

Once deployed, you can access:

```
Main App: file:///.../index.html
Login Page: file:///.../index.html
Dashboard: file:///.../dashboard.html
Admin Panel: file:///.../admin.html
```

Or use Python simple server:
```powershell
cd "c:\Users\...\New folder (3)"
python -m http.server 8000
# Then open: http://localhost:8000
```

---

## 📚 Reference Files

**Main Configuration Files:**
1. `config.js` - Frontend configuration (APPS_SCRIPT_URL)
2. `APPS_SCRIPT_CODE.gs` - Backend configuration (3 values)

**Documentation:**
1. `APPS_SCRIPT_DEPLOYMENT.md` - Detailed deployment guide
2. `PROJECT_ANALYSIS.md` - System architecture
3. `GOOGLE_SHEET_AUTH_DESIGN.md` - Database schema

---

## ✅ Configuration Complete Verification

Before testing, verify:

```
APPS_SCRIPT_CODE.gs:
Line 7:  const SHEET_ID = "YOUR_SHEET_ID";               ✅
Line 8:  const JWT_SECRET = "your-secret-key-here";      ✅
Line 9:  const ADMIN_PASSWORD = "admin@123";             ✅

config.js:
Line 6:  const APPS_SCRIPT_URL = "https://...";          ✅

HTML Files:
- index.html has <script src="config.js"></script>       ✅
- dashboard.html has <script src="./config.js"></script> ✅
- admin.html has <script src="./config.js"></script>     ✅
```

---

**All set! Proceed to APPS_SCRIPT_DEPLOYMENT.md for full deployment steps.**

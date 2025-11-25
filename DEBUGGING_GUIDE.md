# 🔍 Debugging Guide - Apps Script Connection Issues

## ✅ Step 1: Verify Apps Script Deployment

### 1.1 Test if Apps Script URL is Reachable
```bash
# Open this URL in your browser:
https://script.google.com/macros/s/AKfycbyDXWrKHbmHc529pET-KQZPrrhsJnq5lp2qAdPfs5d-e8rWElPyxibNJEL1T-m0ABNwrg/exec
```

**Expected Response** (JSON):
```json
{
  "status": "running",
  "message": "HBZxLRG API Server is active",
  "timestamp": "...",
  "endpoints": {...},
  "admin_users_configured": 2,
  "sheet_id": "1E4XnIbPD...",
  "timezone": "Asia/Bangkok"
}
```

**If you see HTML error instead:**
- ❌ **401 Unauthorized**: Apps Script URL is no longer valid (deployment expired/changed)
- ❌ **404 Not Found**: Wrong URL in config.js
- ❌ **No response**: Apps Script service down

---

## ✅ Step 2: Check Browser Console Logs

### 2.1 Open Browser Developer Tools
```
F12 (Windows/Linux)
Cmd + Option + I (Mac)
```

### 2.2 Go to Console Tab
Look for these debug messages when you click login:

**✅ Success Flow:**
```
📤 Sending to Apps Script [login]: {action: "login", username: "nnchchc", password: "nnchchc1"}
📍 URL: https://script.google.com/macros/s/AKfycbyDXWrKHbmHc529pET-KQZPrrhsJnq5lp2qAdPfs5d-e8rWElPyxibNJEL1T-m0ABNwrg/exec
📥 Response Status: 200 OK
✅ Parsed Response: {success: true, token: "...", username: "nnchchc", email: "..."}
```

**❌ Error Flow:**
```
📤 Sending to Apps Script [login]: {...}
📥 Response Status: 403
❌ HTTP Error: 403
Response Body: <html>Error 403...</html>
```

---

## ✅ Step 3: Common Issues & Solutions

### Issue 1: "Response Status: 403 / 401"
**Cause:** Apps Script deployment URL is dead or access permissions changed

**Solutions:**
1. **Redeploy Apps Script:**
   - Open Google Apps Script: `script.google.com`
   - Go to Projects → Find your project
   - Click "Deploy" → "New deployment"
   - Select "Web app"
   - Execute as: (your email)
   - Who has access: "Anyone"
   - Click "Deploy"
   - Copy the new URL from the dialog
   - **Update `config.js` line 8 with new URL**

2. **Check Permissions:**
   - Make sure deployment is set to "Anyone" (not just you)
   - Check Google Sheet sharing settings

### Issue 2: "Response Status: 200 but can't parse JSON"
**Cause:** Server returning HTML or empty response instead of JSON

**Check:**
```
// In APPS_SCRIPT_CODE.gs, verify:
// 1. doPost() has proper error handling
// 2. All endpoints return JSON via JSON.stringify()
// 3. No console.log() that corrupts JSON output
```

### Issue 3: "Network Error: Failed to fetch"
**Cause:** CORS issue or network connectivity

**Solutions:**
```javascript
// Apps Script automatically handles CORS for POST requests
// But make sure:
// 1. URL is exactly correct (copy-paste from deployment)
// 2. Content-Type header is set (already done in config.js)
// 3. Not behind corporate firewall/VPN blocking script.google.com
```

---

## ✅ Step 4: Test Login Flow

### 4.1 Credentials to Test
```
Primary Admin:
  Username: nnchchc
  Password: nnchchc1

Backup Admin:
  Username: adminkong
  Password: kong
```

### 4.2 Expected Behavior
1. ✅ Enter credentials
2. ✅ Click Login
3. ✅ See console logs (Step 2.2)
4. ✅ Redirect to dashboard.html
5. ✅ Admin Panel button visible (since logged-in user is admin)

### 4.3 If Login Fails
- ✅ Check console logs first (Step 2.2)
- ✅ Verify Apps Script URL accessible (Step 1)
- ✅ Check Google Sheet has "Users" sheet with data
- ✅ Verify SHEET_ID in APPS_SCRIPT_CODE.gs matches your Sheet

---

## ✅ Step 5: Test Each Endpoint Independently

### 5.1 Manual Fetch Test (Copy to Browser Console)
```javascript
// Test if fetch works
fetch("https://script.google.com/macros/s/AKfycbyDXWrKHbmHc529pET-KQZPrrhsJnq5lp2qAdPfs5d-e8rWElPyxibNJEL1T-m0ABNwrg/exec", {
  method: 'POST',
  body: JSON.stringify({
    action: 'login',
    username: 'nnchchc',
    password: 'nnchchc1'
  }),
  headers: { 'Content-Type': 'application/json' }
})
.then(r => {
  console.log('Status:', r.status, r.statusText);
  return r.json();
})
.then(data => console.log('Response:', data))
.catch(e => console.error('Error:', e));
```

**Expected Output:**
```javascript
Status: 200 OK
Response: {success: true, token: "...", username: "nnchchc", ...}
```

---

## ✅ Step 6: Check Google Sheet Integration

### 6.1 Verify Google Sheet Setup
1. Open your Google Sheet
2. Check that first sheet is named **"Users"** (exactly)
3. Verify columns: A-K with headers:
   - A: ID
   - B: Username
   - C: Email
   - D: PasswordHash
   - E: Balance
   - F: Status
   - G: Created
   - H: LastLogin
   - I: Token
   - J: ResetToken
   - K: ResetTokenExp

### 6.2 Manually Insert Test User
Add a row to Sheet:
```
1 | testuser | test@example.com | $2b$10$... | 1000 | active | 25-11-25 10:00:00 | 25-11-25 10:00:00 | token123 | | 
```

---

## ✅ Step 7: Trace Errors in Apps Script Logs

### 7.1 View Apps Script Execution Logs
1. Open Apps Script: `script.google.com`
2. Find your project
3. Click "Executions" (left sidebar)
4. Look for recent failed executions (red X)
5. Click error to see stack trace

### 7.2 Add Debug Logging to APPS_SCRIPT_CODE.gs
```javascript
function doPost(e) {
  Logger.log("=== REQUEST RECEIVED ===");
  Logger.log("postData exists:", !!e.postData);
  Logger.log("postData.contents:", e.postData?.contents);
  
  try {
    // ... rest of code
  } catch (error) {
    Logger.log("ERROR in doPost:", error);
    Logger.log("Stack:", error.stack);
  }
}
```

---

## 📋 Complete Checklist

- [ ] Apps Script URL is reachable (Step 1)
- [ ] Console logs show debug messages (Step 2)
- [ ] No HTTP errors (403, 404, 500) in Response Status (Step 2)
- [ ] Apps Script deployment set to "Anyone" access
- [ ] config.js has correct deployment URL (line 8)
- [ ] Google Sheet is shared and contains "Users" sheet
- [ ] SHEET_ID in APPS_SCRIPT_CODE.gs matches your Sheet ID
- [ ] ADMIN_USERS in APPS_SCRIPT_CODE.gs includes your credentials
- [ ] Login attempt shows success message and redirects to dashboard

---

## 🆘 If All Else Fails

### Option 1: Deploy Fresh Apps Script
```
1. Create new Google Apps Script project
2. Copy all code from APPS_SCRIPT_CODE.gs
3. Deploy as Web App → New URL
4. Update config.js line 8 with new URL
5. Test again
```

### Option 2: Check Sheet Permissions
```
1. Open Google Sheet
2. Click "Share"
3. Make sure sheet is shared with "Anyone with link"
4. Permission level: "Viewer" minimum
```

### Option 3: Enable Advanced Google Services
```
1. Apps Script: Extensions → Apps Script API
2. Make sure it's enabled
3. Re-deploy
```

---

## 📞 Support Information

**Current Configuration:**
- SHEET_ID: `1E4XnIbPDQnRXu5cBJ8tyYKauOshZSbsYPJdVwRvIEXI`
- JWT_SECRET: `ddoss`
- TIMEZONE: `Asia/Bangkok`
- APPS_SCRIPT_URL: See config.js line 8

**Files to Check:**
- `config.js` - Frontend API configuration (Line 8 = URL)
- `APPS_SCRIPT_CODE.gs` - Backend logic (Line 9 = SHEET_ID)
- `script.js` - Login handler (Line 143 = apiLogin call)
- `dashboard.js` - After login redirect

---

**Generated:** Nov 25, 2025  
**Version:** 3.0

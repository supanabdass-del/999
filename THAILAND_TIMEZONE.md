# ⏰ Thailand Timezone & Time Format Configuration

ระบบจัดการเวลาของ HBZxLRG

---

## 📅 Time Format

**Current Format**: `DD-MM-YY HH:MM:SS` (Thailand Time)

### Format Breakdown
- **DD** = Day (01-31)
- **MM** = Month (01-12)
- **YY** = Year (2 digits)
- **HH** = Hour (00-23)
- **MM** = Minute (00-59)
- **SS** = Second (00-59)

### Examples
```
25-11-25 14:30:45   (November 25, 2025 at 2:30:45 PM)
01-01-26 00:00:00   (January 1, 2026 at midnight)
15-06-25 23:59:59   (June 15, 2025 at 11:59:59 PM)
```

---

## 🌏 Timezone

**Timezone**: Asia/Bangkok (UTC+7)

### Current Time Examples
```
Thailand: 14:30:45
Japan:    16:30:45 (UTC+9)
UTC:      07:30:45 (UTC+0)
```

---

## 🔧 Implementation Details

### Function: formatThaiTime()

**Location**: `APPS_SCRIPT_CODE.gs` (lines 127-142)

**Usage**:
```javascript
const thaiTime = formatThaiTime(new Date());
// Output: "25-11-25 14:30:45"
```

**Parameters**:
- `date` (optional) - Date object, defaults to current date

**Returns**:
- String in format: `DD-MM-YY HH:MM:SS`

---

## 📍 Where Time Format is Used

1. **User Account Creation** (Created_At)
   - Records when user signs up
   - Format: DD-MM-YY HH:MM:SS

2. **Last Login** (Last_Login)
   - Records when user last logged in
   - Format: DD-MM-YY HH:MM:SS

3. **Password Reset Token Expiry** (Reset_Token_Expiry)
   - Marks when reset token expires
   - Format: DD-MM-YY HH:MM:SS

4. **Updated_At** (Updated_At)
   - Records when profile was last updated
   - Format: DD-MM-YY HH:MM:SS

---

## 🔄 Time-Based Features

### Token Expiration
```
Token created at: 25-11-25 10:00:00
Token expires in:  7 days
Token expires at:  02-12-25 10:00:00
```

### Reset Token Expiration
```
Reset token created:  25-11-25 10:00:00
Reset token expires:  1 hour
Reset token expires:  25-11-25 11:00:00
```

---

## 🧪 Testing Thailand Time

### Manual Verification in Google Sheet:
1. Create a test account
2. Check "Created_At" column
3. Verify format is `DD-MM-YY HH:MM:SS`
4. Verify timezone is Thailand (UTC+7)

### Checking Current Time:
```javascript
// In Apps Script Editor → Execution Logs
Logger.log(formatThaiTime(new Date()));
// Output: "25-11-25 14:30:45"
```

---

## ⚙️ Timezone Configuration

**File**: `APPS_SCRIPT_CODE.gs` (line 15)

```javascript
const THAILAND_TZ = "Asia/Bangkok";
```

### Supported Timezone Names
- `Asia/Bangkok` - Thailand (UTC+7)
- `Asia/Bangkok` is ALWAYS used
- Changing not recommended

---

## 📊 Time Format in Database

### Google Sheet Columns Using Time Format

| Column | Name | Example |
|--------|------|---------|
| E | Created_At | 25-11-25 14:30:45 |
| F | Updated_At | 25-11-25 14:30:45 |
| I | Token_Expiry | 02-12-25 10:00:00 |
| K | Reset_Token_Expiry | 25-11-25 11:00:00 |

---

## 🔀 Converting Time

### To Display Different Timezone (Example: UTC)

If you need to show UTC time instead of Thailand time:

```javascript
// Current implementation (Thailand)
formatThaiTime(new Date())  // Output: 25-11-25 14:30:45

// To convert to UTC (UTC+7 - 7 hours)
// 14:30:45 Thailand = 07:30:45 UTC
```

---

## 📝 Format Constants

```javascript
// Timezone constant
const THAILAND_TZ = "Asia/Bangkok";

// Format pattern (for reference)
// DD-MM-YY HH:MM:SS
```

---

## ⏱️ Examples of Automatic Time Logging

### When User Signs Up
```javascript
// Automatically logs:
Created_At: 25-11-25 14:30:45 (current time in Thailand)
```

### When User Logs In
```javascript
// Automatically logs:
Last_Login: 25-11-25 14:35:20 (current time in Thailand)
```

### When User Requests Password Reset
```javascript
// Automatically logs:
Reset_Token_Expiry: 25-11-25 15:35:20 (1 hour from now)
```

---

## ✅ Verification Checklist

- [x] Function `formatThaiTime()` exists in Apps Script
- [x] Timezone set to `Asia/Bangkok`
- [x] Time format is `DD-MM-YY HH:MM:SS`
- [x] All timestamps use Thailand timezone
- [x] Token expiry times calculated correctly
- [x] Reset token expiry times calculated correctly

---

## 🔗 Related Files

- **APPS_SCRIPT_CODE.gs** - `formatThaiTime()` function implementation
- **CONFIG_REFERENCE.md** - Configuration values reference
- **ADMIN_CREDENTIALS.md** - Admin user credentials

---

**Format Version**: 1.0
**Timezone**: Asia/Bangkok (UTC+7)
**Updated**: 2024
**Status**: Active ✅

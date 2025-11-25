// ==================== GOOGLE APPS SCRIPT - AUTHENTICATION SYSTEM ====================
// Sheet Name: "Users" (11 Columns: A-K)
// Deploy as Web App: Execute as your email, Who has access: Anyone

// ==================== CONFIGURATION ====================

const SHEET_ID = "1E4XnIbPDQnRXu5cBJ8tyYKauOshZSbsYPJdVwRvIEXI"; // Replace with your Sheet ID
const SHEET_NAME = "Users";
const JWT_SECRET = "ddoss"; // ต้องเปลี่ยน!
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
const RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

// Admin Users (Primary and Backup)
const ADMIN_USERS = [
  { username: "nnchchc", password: "nnchchc1", role: "primary" },
  { username: "adminkong", password: "kong", role: "backup" }
];

// Thailand Timezone
const THAILAND_TZ = "Asia/Bangkok";

// ==================== UTILITY FUNCTIONS ====================

function getSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(SHEET_NAME);
}

function getDownloadSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName("Downloads");
}

function getAllData() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  
  const data = sheet.getRange(2, 1, lastRow - 1, 11).getValues();
  return data;
}

function getHeaderRow() {
  const sheet = getSheet();
  return sheet.getRange(1, 1, 1, 11).getValues()[0];
}

function findUserByUsername(username) {
  const data = getAllData();
  for (let i = 0; i < data.length; i++) {
    if (data[i][1] === username) { // Column B (index 1)
      return { row: i + 2, data: data[i] }; // +2 because data starts from row 2
    }
  }
  return null;
}

function findUserByEmail(email) {
  const data = getAllData();
  for (let i = 0; i < data.length; i++) {
    if (data[i][2] === email) { // Column C (index 2)
      return { row: i + 2, data: data[i] };
    }
  }
  return null;
}

function findUserByResetToken(resetToken) {
  const data = getAllData();
  for (let i = 0; i < data.length; i++) {
    if (data[i][9] === resetToken) { // Column J (index 9)
      return { row: i + 2, data: data[i] };
    }
  }
  return null;
}

function hashPassword(password) {
  // Simple hash using SHA-256 (development mode)
  // In production, use bcrypt or similar
  const hashed = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
  return Utilities.base64Encode(hashed);
}

function verifyPassword(password, hash) {
  // Verify password by comparing hashes
  const testHash = hashPassword(password);
  return hash === testHash;
}

function generateToken(username, userId) {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  
  const payload = {
    username: username,
    userId: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
  };
  
  // Simple JWT (not cryptographically secure - use proper JWT library in production)
  const token = Utilities.base64Encode(JSON.stringify(header)) + "." +
                Utilities.base64Encode(JSON.stringify(payload)) + "." +
                Utilities.base64Encode(JWT_SECRET);
  
  return token;
}

function generateResetToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidUsername(username) {
  // 4-20 characters, alphanumeric + underscore
  const regex = /^[a-zA-Z0-9_]{4,20}$/;
  return regex.test(username);
}

function isValidPassword(password) {
  // At least 8 characters
  return password.length >= 8;
}

function formatThaiTime(date) {
  // Format: DD-MM-YY HH:MM:SS (Thailand timezone)
  if (!date) date = new Date();
  
  const thaiDate = new Date(date.toLocaleString('en-US', { timeZone: THAILAND_TZ }));
  
  const day = String(thaiDate.getDate()).padStart(2, '0');
  const month = String(thaiDate.getMonth() + 1).padStart(2, '0');
  const year = String(thaiDate.getFullYear()).slice(-2);
  const hours = String(thaiDate.getHours()).padStart(2, '0');
  const minutes = String(thaiDate.getMinutes()).padStart(2, '0');
  const seconds = String(thaiDate.getSeconds()).padStart(2, '0');
  
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function verifyAdminUser(username, password) {
  // Check if user is admin
  for (let admin of ADMIN_USERS) {
    if (admin.username === username && admin.password === password) {
      return { success: true, role: admin.role };
    }
  }
  return { success: false };
}

function sendResetEmail(email, resetToken, username) {
  // Gmail feature disabled for development
  // In production, implement proper email service (SendGrid, Mailgun, etc.)
  // or grant Gmail API permissions to Apps Script
  
  // For now, return success to allow password reset flow
  // The reset token is stored in the sheet and can be manually checked
  Logger.log(`Reset Token for ${username}: ${resetToken}`);
  return true;
}

// ==================== DOWNLOAD LINKS ====================

function getDownloadLinks() {
  try {
    const sheet = getDownloadSheet();
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return { success: false, message: "ไม่มีข้อมูลดาวน์โหลด" };
    }
    
    // Get data from Downloads sheet (rows 2 onwards, columns A-C)
    // Row 2 = index 0, Row 3 = index 1, etc.
    const data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
    
    // Map data to download links object
    // data[0] = Row 2 (B2), data[1] = Row 3 (B3), data[2] = Row 4 (B4), etc.
    const downloads = {
      android: {
        vphonegaga: data[0] && data[0][1] ? data[0][1] : "", // B2
        modMenuFree: data[1] && data[1][1] ? data[1][1] : "", // B3
        modMenuVip: data[2] && data[2][1] ? data[2][1] : "", // B4
        game32bit: data[3] && data[3][1] ? data[3][1] : "", // B5
        mtManager: data[4] && data[4][1] ? data[4][1] : ""  // B6
      },
      pc: {
        mumu12: data[6] && data[6][1] ? data[6][1] : "",     // B8
        modMenuFree: data[1] && data[1][1] ? data[1][1] : "", // B3 (same)
        modMenuVip: data[2] && data[2][1] ? data[2][1] : "",  // B4 (same)
        game32bit: data[3] && data[3][1] ? data[3][1] : "",   // B5 (same)
        mtManager: data[4] && data[4][1] ? data[4][1] : ""    // B6 (same)
      }
    };
    
    Logger.log("Download links loaded:", downloads);
    
    return {
      success: true,
      downloads: downloads
    };
    
  } catch (e) {
    Logger.log("Get download links error: " + e);
    return { success: false, message: "เกิดข้อผิดพลาด: " + e };
  }
}

// ==================== MAIN FUNCTIONS ====================

// 1. SIGNUP
function handleSignup(username, email, password, confirmPassword) {
  try {
    // Validate input
    if (!username || !email || !password || !confirmPassword) {
      return { success: false, message: "กรุณากรอกข้อมูลให้ครบ" };
    }
    
    if (password !== confirmPassword) {
      return { success: false, message: "รหัสผ่านไม่ตรงกัน" };
    }
    
    if (!isValidUsername(username)) {
      return { success: false, message: "ชื่อผู้ใช้ต้อง 4-20 ตัวอักษร (a-z, A-Z, 0-9, _)" };
    }
    
    if (!isValidEmail(email)) {
      return { success: false, message: "อีเมลไม่ถูกต้อง" };
    }
    
    if (!isValidPassword(password)) {
      return { success: false, message: "รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร" };
    }
    
    // Check if username exists
    if (findUserByUsername(username)) {
      return { success: false, message: "ชื่อผู้ใช้นี้มีผู้ใช้แล้ว" };
    }
    
    // Check if email exists
    if (findUserByEmail(email)) {
      return { success: false, message: "อีเมลนี้มีผู้ใช้แล้ว" };
    }
    
    // Hash password
    const passwordHash = hashPassword(password);
    
    // Get next ID
    const allData = getAllData();
    const nextId = allData.length > 0 ? Math.max(...allData.map(row => row[0])) + 1 : 1;
    
    // Prepare new row
    const newRow = [
      nextId,
      username,
      email,
      passwordHash,
      0, // Balance
      "active", // Status
      new Date(), // Created
      "", // Last Login
      "", // Token
      "", // Reset Token
      "" // Reset Token Expiry
    ];
    
    // Add to sheet
    const sheet = getSheet();
    sheet.appendRow(newRow);
    
    // Generate token
    const token = generateToken(username, nextId);
    
    // Update token in sheet
    sheet.getRange(sheet.getLastRow(), 9).setValue(token); // Column I (Token)
    
    return {
      success: true,
      message: "สมัครสมาชิกสำเร็จ",
      token: token,
      userId: nextId,
      username: username,
      email: email
    };
    
  } catch (e) {
    Logger.log("Signup error: " + e);
    return { success: false, message: "เกิดข้อผิดพลาดในการสมัครสมาชิก" };
  }
}

// 2. LOGIN
function handleLogin(username, password) {
  try {
    if (!username || !password) {
      return { success: false, message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" };
    }
    
    // First check if user is admin (hardcoded)
    const adminVerify = verifyAdminUser(username, password);
    if (adminVerify.success) {
      // Admin user - generate token and return admin role
      const token = generateToken(username, 0); // ID 0 for admin users
      return {
        success: true,
        message: "เข้าสู่ระบบสำเร็จ",
        token: token,
        userId: 0,
        username: username,
        email: username + "@admin.local",
        balance: 0,
        role: adminVerify.role || 'admin'
      };
    }
    
    // Check in sheet
    const user = findUserByUsername(username);
    if (!user) {
      return { success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    }
    
    const userData = user.data;
    const userId = userData[0];
    const storedHash = userData[3];
    const status = userData[5];
    
    // Check status
    if (status === "banned") {
      return { success: false, message: "บัญชีนี้ถูกระงับแล้ว" };
    }
    
    if (status === "inactive") {
      return { success: false, message: "บัญชีนี้ไม่ทำงาน" };
    }
    
    // Verify password
    if (!verifyPassword(password, storedHash)) {
      return { success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    }
    
    // Generate token
    const token = generateToken(username, userId);
    
    // Update sheet: Token + Last Login
    const sheet = getSheet();
    sheet.getRange(user.row, 9).setValue(token); // Column I (Token)
    sheet.getRange(user.row, 8).setValue(new Date()); // Column H (Last Login)
    
    return {
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      token: token,
      userId: userId,
      username: username,
      email: userData[2],
      balance: userData[4],
      role: userData[6] === 'admin' ? 'admin' : 'user' // Return role from sheet if exists
    };
    
  } catch (e) {
    Logger.log("Login error: " + e);
    return { success: false, message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" };
  }
}

// 3. FORGOT PASSWORD
function handleForgotPassword(username, email) {
  try {
    if (!username || !email) {
      return { success: false, message: "กรุณากรอกชื่อผู้ใช้และอีเมล" };
    }

    // Find user by username and verify email matches
    const user = findUserByUsername(username);
    if (!user) {
      return { success: false, message: "ไม่พบบัญชีนี้ในระบบ" };
    }

    const userData = user.data;
    const storedEmail = userData[2];
    if (storedEmail !== email) {
      return { success: false, message: "อีเมลไม่ตรงกับบัญชีผู้ใช้" };
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const expiryTime = new Date(Date.now() + RESET_TOKEN_EXPIRY);

    // Update sheet: Reset Token + Expiry
    const sheet = getSheet();
    sheet.getRange(user.row, 10).setValue(resetToken); // Column J (Reset Token)
    sheet.getRange(user.row, 11).setValue(expiryTime); // Column K (Reset Token Expiry)

    // For development: return token directly (no email delivery)
    return {
      success: true,
      message: "Reset token ถูกสร้างเรียบร้อย",
      resetToken: resetToken
    };

  } catch (e) {
    Logger.log("Forgot password error: " + e);
    return { success: false, message: "เกิดข้อผิดพลาด" };
  }
}

// 4. RESET PASSWORD
function handleResetPassword(resetToken, newPassword) {
  try {
    if (!resetToken || !newPassword) {
      return { success: false, message: "ข้อมูลไม่ครบ" };
    }
    
    if (!isValidPassword(newPassword)) {
      return { success: false, message: "รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร" };
    }
    
    const user = findUserByResetToken(resetToken);
    if (!user) {
      return { success: false, message: "ลิงก์รีเซ็ตไม่ถูกต้อง" };
    }
    
    const userData = user.data;
    const expiryTime = userData[10];
    
    // Check if token expired
    if (new Date() > new Date(expiryTime)) {
      return { success: false, message: "ลิงก์รีเซ็ตหมดอายุแล้ว" };
    }
    
    // Hash new password
    const newHash = hashPassword(newPassword);
    
    // Update sheet: Password + Clear Reset Token
    const sheet = getSheet();
    sheet.getRange(user.row, 4).setValue(newHash); // Column D (Password)
    sheet.getRange(user.row, 10).setValue(""); // Column J (Reset Token)
    sheet.getRange(user.row, 11).setValue(""); // Column K (Reset Token Expiry)
    
    return {
      success: true,
      message: "เปลี่ยนรหัสผ่านสำเร็จ"
    };
    
  } catch (e) {
    Logger.log("Reset password error: " + e);
    return { success: false, message: "เกิดข้อผิดพลาด" };
  }
}

// 5. CHANGE PASSWORD
function handleChangePassword(username, oldPassword, newPassword) {
  try {
    if (!username || !oldPassword || !newPassword) {
      return { success: false, message: "กรุณากรอกข้อมูลให้ครบ" };
    }
    
    if (!isValidPassword(newPassword)) {
      return { success: false, message: "รหัสผ่านใหม่ต้องอย่างน้อย 8 ตัวอักษร" };
    }
    
    const user = findUserByUsername(username);
    if (!user) {
      return { success: false, message: "ไม่พบผู้ใช้นี้" };
    }
    
    const userData = user.data;
    const storedHash = userData[3];
    
    // Verify old password
    if (!verifyPassword(oldPassword, storedHash)) {
      return { success: false, message: "รหัสผ่านเดิมไม่ถูกต้อง" };
    }
    
    // Hash new password
    const newHash = hashPassword(newPassword);
    
    // Update sheet
    const sheet = getSheet();
    sheet.getRange(user.row, 4).setValue(newHash); // Column D (Password)
    
    return {
      success: true,
      message: "เปลี่ยนรหัสผ่านสำเร็จ"
    };
    
  } catch (e) {
    Logger.log("Change password error: " + e);
    return { success: false, message: "เกิดข้อผิดพลาด" };
  }
}

// ==================== ADMIN FUNCTIONS ====================

function getAllUsers(adminUsername, adminPassword) {
  const adminVerify = verifyAdminUser(adminUsername, adminPassword);
  if (!adminVerify.success) {
    return { success: false, message: "ชื่อผู้ใช้ Admin หรือรหัสผ่าน Admin ไม่ถูกต้อง" };
  }
  
  const data = getAllData();
  const users = data.map(row => ({
    id: row[0],
    username: row[1],
    email: row[2],
    passwordHash: row[3],
    balance: row[4],
    status: row[5],
    created: row[6],
    lastLogin: row[7],
    token: row[8],
    resetToken: row[9],
    resetTokenExp: row[10]
  }));
  
  return { success: true, users: users };
}

function getUserById(adminUsername, adminPassword, userId) {
  const adminVerify = verifyAdminUser(adminUsername, adminPassword);
  if (!adminVerify.success) {
    return { success: false, message: "ชื่อผู้ใช้ Admin หรือรหัสผ่าน Admin ไม่ถูกต้อง" };
  }
  
  const data = getAllData();
  const userData = data.find(row => row[0] == userId);
  
  if (!userData) {
    return { success: false, message: "ไม่พบผู้ใช้นี้" };
  }
  
  return {
    success: true,
    user: {
      id: userData[0],
      username: userData[1],
      email: userData[2],
      passwordHash: userData[3],
      balance: userData[4],
      status: userData[5],
      created: userData[6],
      lastLogin: userData[7],
      token: userData[8],
      resetToken: userData[9],
      resetTokenExp: userData[10]
    }
  };
}

function updateUser(adminUsername, adminPassword, userId, updates) {
  const adminVerify = verifyAdminUser(adminUsername, adminPassword);
  if (!adminVerify.success) {
    return { success: false, message: "ชื่อผู้ใช้ Admin หรือรหัสผ่าน Admin ไม่ถูกต้อง" };
  }
  
  const user = getAllData().find(row => row[0] == userId);
  if (!user) {
    return { success: false, message: "ไม่พบผู้ใช้นี้" };
  }
  
  const data = getAllData();
  const rowIndex = data.findIndex(row => row[0] == userId);
  const sheet = getSheet();
  const sheetRow = rowIndex + 2;
  
  // Update fields
  if (updates.username !== undefined) {
    sheet.getRange(sheetRow, 2).setValue(updates.username);
  }
  if (updates.email !== undefined) {
    sheet.getRange(sheetRow, 3).setValue(updates.email);
  }
  if (updates.passwordHash !== undefined) {
    sheet.getRange(sheetRow, 4).setValue(updates.passwordHash);
  }
  if (updates.balance !== undefined) {
    sheet.getRange(sheetRow, 5).setValue(updates.balance);
  }
  if (updates.status !== undefined) {
    sheet.getRange(sheetRow, 6).setValue(updates.status);
  }
  
  return { success: true, message: "อัปเดตผู้ใช้สำเร็จ" };
}

function deleteUser(adminUsername, adminPassword, userId) {
  const adminVerify = verifyAdminUser(adminUsername, adminPassword);
  if (!adminVerify.success) {
    return { success: false, message: "ชื่อผู้ใช้ Admin หรือรหัสผ่าน Admin ไม่ถูกต้อง" };
  }
  
  const data = getAllData();
  const rowIndex = data.findIndex(row => row[0] == userId);
  
  if (rowIndex === -1) {
    return { success: false, message: "ไม่พบผู้ใช้นี้" };
  }
  
  const sheet = getSheet();
  sheet.deleteRow(rowIndex + 2); // +2 because data starts from row 2
  
  return { success: true, message: "ลบผู้ใช้สำเร็จ" };
}

function reissueToken(adminUsername, adminPassword, userId) {
  const adminVerify = verifyAdminUser(adminUsername, adminPassword);
  if (!adminVerify.success) {
    return { success: false, message: "ชื่อผู้ใช้ Admin หรือรหัสผ่าน Admin ไม่ถูกต้อง" };
  }
  
  const result = getUserById(adminUsername, adminPassword, userId);
  if (!result.success) return result;
  
  const user = result.user;
  const newToken = generateToken(user.username, user.id);
  
  const data = getAllData();
  const rowIndex = data.findIndex(row => row[0] == userId);
  const sheet = getSheet();
  
  sheet.getRange(rowIndex + 2, 9).setValue(newToken);
  
  return { success: true, message: "Reissue token สำเร็จ", token: newToken };
}

function resetUserPassword(adminUsername, adminPassword, userId, newPassword) {
  const adminVerify = verifyAdminUser(adminUsername, adminPassword);
  if (!adminVerify.success) {
    return { success: false, message: "ชื่อผู้ใช้ Admin หรือรหัสผ่าน Admin ไม่ถูกต้อง" };
  }
  
  if (!isValidPassword(newPassword)) {
    return { success: false, message: "รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร" };
  }
  
  const result = getUserById(adminUsername, adminPassword, userId);
  if (!result.success) return result;
  
  const newHash = hashPassword(newPassword);
  
  const data = getAllData();
  const rowIndex = data.findIndex(row => row[0] == userId);
  const sheet = getSheet();
  
  sheet.getRange(rowIndex + 2, 4).setValue(newHash);
  
  return { success: true, message: "รีเซ็ตรหัสผ่านสำเร็จ" };
}

function banUser(adminUsername, adminPassword, userId) {
  const adminVerify = verifyAdminUser(adminUsername, adminPassword);
  if (!adminVerify.success) {
    return { success: false, message: "ชื่อผู้ใช้ Admin หรือรหัสผ่าน Admin ไม่ถูกต้อง" };
  }
  
  return updateUser(adminUsername, adminPassword, userId, { status: "banned" });
}

function unbanUser(adminUsername, adminPassword, userId) {
  const adminVerify = verifyAdminUser(adminUsername, adminPassword);
  if (!adminVerify.success) {
    return { success: false, message: "ชื่อผู้ใช้ Admin หรือรหัสผ่าน Admin ไม่ถูกต้อง" };
  }
  
  return updateUser(adminUsername, adminPassword, userId, { status: "active" });
}

function exportUsers(adminUsername, adminPassword) {
  const adminVerify = verifyAdminUser(adminUsername, adminPassword);
  if (!adminVerify.success) {
    return { success: false, message: "ชื่อผู้ใช้ Admin หรือรหัสผ่าน Admin ไม่ถูกต้อง" };
  }
  
  const result = getAllUsers(adminUsername, adminPassword);
  if (!result.success) return result;
  
  // Convert to CSV
  let csv = "ID,Username,Email,Password Hash,Balance,Status,Created,Last Login,Token,Reset Token,Reset Token Exp\n";
  result.users.forEach(user => {
    csv += `${user.id},"${user.username}","${user.email}","${user.passwordHash}",${user.balance},"${user.status}","${user.created}","${user.lastLogin}","${user.token}","${user.resetToken}","${user.resetTokenExp}"\n`;
  });
  
  return { success: true, csv: csv };
}

// ==================== WEB APP HANDLER ====================

function doPost(e) {
  try {
    // Handle Google Apps Script postData format (support JSON, x-www-form-urlencoded, and FormData)
    let data;

    try {
      // 1) If postData exists, prefer parsing its contents
      if (e && e.postData && e.postData.contents) {
        const contents = e.postData.contents;
        if (typeof contents === 'string') {
          // Try JSON first
          try {
            data = JSON.parse(contents);
          } catch (jsonErr) {
            // If not JSON, try URL-encoded form data
            try {
              data = {};
              const pairs = contents.split('&');
              pairs.forEach(p => {
                const [k, v] = p.split('=');
                if (k) data[decodeURIComponent(k)] = decodeURIComponent(v || '');
              });
            } catch (urlErr) {
              data = null;
            }
          }
        } else {
          data = contents; // already an object
        }
      }

      // 2) If no postData contents, check e.parameter / e.parameters (FormData or URL params)
      if ((!data || Object.keys(data).length === 0) && e && e.parameter && Object.keys(e.parameter).length > 0) {
        data = {};
        for (const key in e.parameter) {
          // e.parameter values are strings; e.parameters may be arrays
          const val = e.parameter[key];
          data[key] = Array.isArray(val) ? val[0] : val;
        }
      }

      // 3) If still no data, return error
      if (!data || !data.action) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: "Invalid request - missing action or payload"
        })).setMimeType(ContentService.MimeType.JSON);
      }
    } catch (parseErr) {
      Logger.log('doPost parse error: ' + parseErr);
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Failed to parse request payload'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (!data || !data.action) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Invalid request - missing action"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const action = data.action;
    let response;
    
    switch(action) {
      // Auth endpoints
      case 'signup':
        response = handleSignup(data.username, data.email, data.password, data.confirmPassword);
        break;
      case 'login':
        response = handleLogin(data.username, data.password);
        break;
      case 'forgotPassword':
        response = handleForgotPassword(data.username, data.email);
        break;
      case 'resetPassword':
        response = handleResetPassword(data.resetToken, data.newPassword);
        break;
      case 'changePassword':
        response = handleChangePassword(data.username, data.oldPassword, data.newPassword);
        break;
      
      // Admin endpoints
      case 'getAllUsers':
        response = getAllUsers(data.adminUsername, data.adminPassword);
        break;
      case 'getUserById':
        response = getUserById(data.adminUsername, data.adminPassword, data.userId);
        break;
      case 'updateUser':
        response = updateUser(data.adminUsername, data.adminPassword, data.userId, data.updates);
        break;
      case 'deleteUser':
        response = deleteUser(data.adminUsername, data.adminPassword, data.userId);
        break;
      case 'reissueToken':
        response = reissueToken(data.adminUsername, data.adminPassword, data.userId);
        break;
      case 'resetUserPassword':
        response = resetUserPassword(data.adminUsername, data.adminPassword, data.userId, data.newPassword);
        break;
      case 'banUser':
        response = banUser(data.adminUsername, data.adminPassword, data.userId);
        break;
      case 'unbanUser':
        response = unbanUser(data.adminUsername, data.adminPassword, data.userId);
        break;
      case 'exportUsers':
        response = exportUsers(data.adminUsername, data.adminPassword);
        break;
      
      // Download endpoints
      case 'getDownloadLinks':
        response = getDownloadLinks();
        break;
      
      default:
        response = { success: false, message: "Invalid action" };
    }
    
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (e) {
    Logger.log("Error: " + e);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Server error: " + e
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Diagnostic endpoint to check if Apps Script is deployed correctly
  const info = {
    status: "running",
    message: "HBZxLRG API Server is active",
    timestamp: new Date().toISOString(),
    endpoints: {
      signup: "POST",
      login: "POST",
      forgotPassword: "POST",
      resetPassword: "POST",
      changePassword: "POST",
      getAllUsers: "POST (admin)",
      getUserById: "POST (admin)",
      updateUser: "POST (admin)",
      deleteUser: "POST (admin)",
      reissueToken: "POST (admin)",
      resetUserPassword: "POST (admin)",
      banUser: "POST (admin)",
      unbanUser: "POST (admin)",
      exportUsers: "POST (admin)"
    },
    admin_users_configured: ADMIN_USERS.length,
    sheet_id: SHEET_ID.substring(0, 10) + "...",
    timezone: THAILAND_TZ
  };
  return ContentService.createTextOutput(JSON.stringify(info))
    .setMimeType(ContentService.MimeType.JSON);
}

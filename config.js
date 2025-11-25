// ==================== APPS SCRIPT CONFIGURATION ====================
// File: config.js
// ใช้สำหรับเก็บ API URL และ config อื่นๆ

// Auto-detect environment (localhost/liveserver/production)
function getAppsScriptURL() {
  const hostname = window.location.hostname;
  
  // Production URL (สำเร็จแล้ว - ใช้ได้บน localhost/liveserver/production)
  const PRODUCTION_URL = "https://script.google.com/macros/s/AKfycbyDXWrKHbmHc529pET-KQZPrrhsJnq5lp2qAdPfs5d-e8rWElPyxibNJEL1T-m0ABNwrg/exec";
  
  // Return production URL for all environments
  // The same URL works for localhost, liveserver, and production
  return PRODUCTION_URL;
}

const APPS_SCRIPT_URL = getAppsScriptURL();
// Admin credentials
const ADMIN_USERS_LIST = [
  { username: "nnchchc", password: "nnchchc1", role: "primary" },
  { username: "adminkong", password: "kong", role: "backup" }
];

// Token storage key
const TOKEN_STORAGE_KEY = "authToken";
const USER_DATA_STORAGE_KEY = "userData";

// Save token to localStorage
function saveToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

// Get token from localStorage
function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

// Save user data to localStorage
function saveUserData(userData) {
  localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userData));
}

// Get user data from localStorage
function getUserData() {
  const data = localStorage.getItem(USER_DATA_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

// Clear all auth data from localStorage
function clearAuthData() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_DATA_STORAGE_KEY);
}

// Check if current logged-in user is admin
function isCurrentUserAdmin() {
  const userData = getUserData();
  if (!userData || !userData.username) return false;
  
  // Check hardcoded ADMIN_USERS_LIST first
  if (ADMIN_USERS_LIST.some(admin => admin.username === userData.username)) {
    return true;
  }
  
  // Also check if userData has role='admin' (returned from server)
  if (userData.role === 'admin') {
    return true;
  }
  
  return false;
}

// Get current user info
function getCurrentAdminInfo() {
  if (!isCurrentUserAdmin()) return null;
  
  const userData = getUserData();
  return ADMIN_USERS_LIST.find(admin => admin.username === userData.username) || null;
}

// API Functions
async function callAppsScript(action, data = {}) {
  try {
    const payload = {
      action: action,
      ...data
    };
    console.log(`📤 Sending to Apps Script [${action}]:`, payload);
    console.log(`📍 URL: ${APPS_SCRIPT_URL}`);

    // Use AbortController to add a timeout for fetch
    const controller = new AbortController();
    const timeoutMs = 15000; // 15s
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Decide whether to send as FormData (no preflight) or JSON (if complex values exist)
    let fetchOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-store',
      credentials: 'omit',
      signal: controller.signal
    };

    // If any payload value is an object (not null) or an array, send JSON
    const hasComplex = Object.values(payload).some(v => v && typeof v === 'object');
    if (hasComplex) {
      fetchOptions.body = JSON.stringify(payload);
      fetchOptions.headers = { 'Content-Type': 'application/json' };
      console.log('Using JSON POST (complex payload)');
    } else {
      // Use FormData to avoid preflight CORS
      const fd = new FormData();
      for (const k in payload) {
        if (payload[k] === undefined || payload[k] === null) continue;
        fd.append(k, String(payload[k]));
      }
      fetchOptions.body = fd;
      console.log('Using FormData POST (avoid preflight)');
    }

    const response = await fetch(APPS_SCRIPT_URL, fetchOptions);

    clearTimeout(timeoutId);

    console.log(`📥 Response Status: ${response.status} ${response.statusText}`);

    // Check if response is ok
    if (!response.ok) {
      console.error(`❌ HTTP Error: ${response.status}`);
      const errorText = await response.text();
      console.error(`Response Body: ${errorText}`);
      return {
        success: false,
        message: `HTTP Error: ${response.status} - ${response.statusText}`
      };
    }

    // Try to parse JSON
    let result;
    try {
      result = await response.json();
      console.log(`✅ Parsed Response:`, result);
      console.log(`   └─ success: ${result.success}, message: ${result.message}, resetToken: ${result.resetToken || 'N/A'}`);
    } catch (parseError) {
      console.error(`❌ Failed to parse JSON:`, parseError);
      const text = await response.text();
      console.error(`Raw Response: ${text}`);
      return {
        success: false,
        message: "ไม่สามารถแปลง response จาก Apps Script",
        raw: text
      };
    }

    return result;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`❌ Fetch Timeout [${action}] after ${timeoutMs}ms`);
      return { success: false, message: `Request timed out after ${timeoutMs}ms` };
    }
    console.error(`❌ Fetch Error [${action}]:`, error);
    console.error(`Error Details:`, error.message, error.stack);
    return {
      success: false,
      message: `Network Error: ${error.message}`
    };
  }
}

// Test connectivity by calling the diagnostic GET endpoint (doGet)
async function testAppsScriptConnection() {
  try {
    console.log(`🔎 Testing Apps Script connection to: ${APPS_SCRIPT_URL}`);
    const controller = new AbortController();
    const timeoutMs = 10000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      credentials: 'omit',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const text = await response.text();
    console.log('doGet status:', response.status, response.statusText);

    try {
      const json = JSON.parse(text);
      console.log('doGet JSON:', json);
      return { success: true, data: json };
    } catch (e) {
      console.warn('doGet returned non-JSON response');
      return { success: false, message: 'Non-JSON response from doGet', raw: text, status: response.status };
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('doGet fetch timed out');
      return { success: false, message: 'Request timed out' };
    }
    console.error('doGet fetch error:', error);
    return { success: false, message: error.message };
  }
}

// Auth API Functions
async function apiSignup(username, email, password, confirmPassword) {
  return callAppsScript('signup', {
    username,
    email,
    password,
    confirmPassword
  });
}

async function apiLogin(username, password) {
  return callAppsScript('login', {
    username,
    password
  });
}

async function apiForgotPassword(username, email) {
  return callAppsScript('forgotPassword', {
    username,
    email
  });
}

async function apiResetPassword(resetToken, newPassword) {
  return callAppsScript('resetPassword', {
    resetToken,
    newPassword
  });
}

async function apiChangePassword(username, oldPassword, newPassword) {
  return callAppsScript('changePassword', {
    username,
    oldPassword,
    newPassword
  });
}

// Admin API Functions
async function apiGetAllUsers(adminUsername, adminPassword) {
  return callAppsScript('getAllUsers', {
    adminUsername,
    adminPassword
  });
}

async function apiGetUserById(adminUsername, adminPassword, userId) {
  return callAppsScript('getUserById', {
    adminUsername,
    adminPassword,
    userId
  });
}

async function apiUpdateUser(adminUsername, adminPassword, userId, updates) {
  return callAppsScript('updateUser', {
    adminUsername,
    adminPassword,
    userId,
    updates
  });
}

async function apiDeleteUser(adminUsername, adminPassword, userId) {
  return callAppsScript('deleteUser', {
    adminUsername,
    adminPassword,
    userId
  });
}

async function apiReissueToken(adminUsername, adminPassword, userId) {
  return callAppsScript('reissueToken', {
    adminUsername,
    adminPassword,
    userId
  });
}

async function apiResetUserPassword(adminUsername, adminPassword, userId, newPassword) {
  return callAppsScript('resetUserPassword', {
    adminUsername,
    adminPassword,
    userId,
    newPassword
  });
}

async function apiBanUser(adminUsername, adminPassword, userId) {
  return callAppsScript('banUser', {
    adminUsername,
    adminPassword,
    userId
  });
}

async function apiUnbanUser(adminUsername, adminPassword, userId) {
  return callAppsScript('unbanUser', {
    adminUsername,
    adminPassword,
    userId
  });
}

async function apiExportUsers(adminUsername, adminPassword) {
  return callAppsScript('exportUsers', {
    adminUsername,
    adminPassword
  });
}

// Download Links API
async function apiGetDownloadLinks() {
  return callAppsScript('getDownloadLinks', {});
}

// Storage Functions
function saveToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function saveUserData(userData) {
  localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userData));
}

function getUserData() {
  const data = localStorage.getItem(USER_DATA_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

function clearUserData() {
  localStorage.removeItem(USER_DATA_STORAGE_KEY);
}

function isLoggedIn() {
  return !!getToken();
}

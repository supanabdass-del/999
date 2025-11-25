// ==================== SIDEBAR TOGGLE ====================
let confirmCallback = null;
let pendingKeyIdToDelete = null;

function showConfirmation(title, message, callback) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    confirmCallback = callback;
    document.getElementById('confirmation-modal').style.display = 'flex';
}

function confirmAction() {
    if (confirmCallback) {
        confirmCallback();
    }
    document.getElementById('confirmation-modal').style.display = 'none';
    confirmCallback = null;
}

function cancelConfirmation() {
    document.getElementById('confirmation-modal').style.display = 'none';
    confirmCallback = null;
}

function showPasswordVerification(keyId) {
    pendingKeyIdToDelete = keyId;
    document.getElementById('verify-password').value = '';
    document.getElementById('password-verification-modal').style.display = 'flex';
}

function cancelPasswordVerification() {
    document.getElementById('password-verification-modal').style.display = 'none';
    document.getElementById('verify-password').value = '';
    pendingKeyIdToDelete = null;
}

function confirmPasswordVerification() {
    const password = document.getElementById('verify-password').value;
    const username = localStorage.getItem('username');
    // Simple password verification - in production, this should be done on server
    // For demo, we accept the same password used during login
    if (!password) {
        showNotification('กรุณากรอกรหัสผ่าน', 'error');
        return;
    }
    
    // If password is valid, proceed with deletion
    if (pendingKeyIdToDelete) {
        proceedWithKeyDeletion(pendingKeyIdToDelete);
    }
    
    document.getElementById('password-verification-modal').style.display = 'none';
    document.getElementById('verify-password').value = '';
    pendingKeyIdToDelete = null;
}

function proceedWithKeyDeletion(keyId) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const keyIndex = userData.keys.findIndex(k => k.id === keyId);
    
    if (keyIndex !== -1) {
        userData.keys.splice(keyIndex, 1);
        localStorage.setItem('userData', JSON.stringify(userData));
        updateDashboardStats();
        displayKeys();
        populateKeySelect();
        populateRenewKeySelect();
        showNotification('ลบ KEY สำเร็จ', 'success');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const isMobile = window.innerWidth <= 768;
    
    sidebar.classList.toggle('collapsed');
    
    // Adjust main content margin based on sidebar state
    if (sidebar.classList.contains('collapsed')) {
        mainContent.style.marginLeft = isMobile ? '70px' : '70px';
    } else {
        mainContent.style.marginLeft = isMobile ? '0' : '280px';
    }

    // Handle overlay click to close sidebar on mobile
    if (!isMobile) return;
    
    const overlay = sidebar.querySelector('::after');
    if (!sidebar.classList.contains('collapsed')) {
        // Add click handler to close sidebar
        document.addEventListener('click', function handleOverlayClick(e) {
            if (!sidebar.contains(e.target) && e.target !== document.querySelector('.sidebar-toggle')) {
                sidebar.classList.add('collapsed');
                mainContent.style.marginLeft = '70px';
                document.removeEventListener('click', handleOverlayClick);
            }
        });
    }
}

// ==================== MODAL FUNCTIONS ====================
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function copyModalKey() {
    const keyId = document.getElementById('modal-key-id').textContent;
    navigator.clipboard.writeText(keyId).then(() => {
        showNotification('คัดลอก KEY สำเร็จ', 'success');
    });
}

// ==================== DATE FORMAT FUNCTION ====================
function formatDate(dateString, includeTime = false) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    
    if (includeTime) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }
    
    return `${day}-${month}-${year}`;
}

// ==================== TIME FORMAT FUNCTION ====================
function formatTime(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds} น.`;
}

// ==================== KEY VISIBILITY FUNCTION ====================
let keyVisibilityState = {};

function formatKeyDisplay(keyId) {
    if (keyVisibilityState[keyId]) {
        return keyId;
    }
    // Show first 5 and last 5, hide middle 5
    if (!keyId || keyId.length < 15) return keyId;
    const first5 = keyId.substring(0, 5);
    const last5 = keyId.substring(10);
    return `${first5}*****${last5}`;
}

function toggleKeyVisibility(keyId, elementId) {
    if (keyVisibilityState[keyId]) {
        keyVisibilityState[keyId] = false;
    } else {
        keyVisibilityState[keyId] = true;
    }
    document.getElementById(elementId).textContent = formatKeyDisplay(keyId);
}

function createKeyDisplayWithToggle(keyId) {
    const displayText = formatKeyDisplay(keyId);
    return `<code id="key-display-${keyId}">${displayText}</code> <button class="btn btn-small btn-secondary" onclick="toggleKeyVisibility('${keyId}', 'key-display-${keyId}')" title="แสดง/ซ่อน KEY"><i class="fas fa-eye"></i></button>`;
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    container.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// Show/Hide Dashboard Pages
function showDashboardPage(pageId, element) {
    // Page title mapping
    const pageTitles = {
        'dashboard-main': 'แดชบอร์ด',
        'topup-page': 'เติมเงิน',
        'buy-key-page': 'ซื้อ KEY VIP',
        'buy-device-page': 'เพิ่มเครื่องล็อกอิน',
        'my-keys-page': 'KEY VIP ของฉัน',
        'renew-key-page': 'ต่ออายุ KEY VIP',
        'topup-history-page': 'ประวัติเติมเงิน',
        'reset-uid-page': 'รีเซ็ต UID',
        'download-page': 'ดาวน์โหลด',
        'tutorial-page': 'วิธีใช้งานและสอนติดตั้ง',
        'profile-page': 'ตั้งค่าโปรไฟล์'
    };

    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');

        // Update page title in topbar
        if (pageTitles[pageId]) {
            document.getElementById('page-title').textContent = pageTitles[pageId];
        }
    }

    // Update active menu item
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    }

    // Initialize page-specific data
    if (pageId === 'buy-device-page') {
        populateKeySelect();
        displayDeviceHistory();
    } else if (pageId === 'buy-key-page') {
        initBuyKeyPage();
    } else if (pageId === 'my-keys-page') {
        displayKeys();
    } else if (pageId === 'renew-key-page') {
        populateRenewKeySelect();
        displayRenewHistory();
    } else if (pageId === 'topup-history-page') {
        displayTopupHistory();
    } else if (pageId === 'reset-uid-page') {
        populateResetUIDKeySelect();
        displayResetUIDHistory();
    } else if (pageId === 'download-page') {
        // Download page doesn't need initialization
    } else if (pageId === 'profile-page') {
        loadProfileData();
    }
}

// Load Dashboard Data on Page Load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    initializeEventListeners();
    checkAdminStatus();
    displayUsername();
});

// Check if current user is admin and show/hide admin panel button
function checkAdminStatus() {
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    if (!adminPanelBtn) {
        console.error("❌ admin-panel-btn element not found");
        return;
    }
    
    const isAdmin = isCurrentUserAdmin();
    console.log("🔐 isCurrentUserAdmin():", isAdmin);
    
    const userData = getUserData();
    console.log("📝 userData in checkAdminStatus():", userData);
    
    if (isAdmin) {
        console.log("✅ Showing admin panel button");
        adminPanelBtn.style.display = 'flex';
    } else {
        console.log("❌ Hiding admin panel button");
        adminPanelBtn.style.display = 'none';
    }
}

// Display logged-in username in top-right corner
function displayUsername() {
    try {
        const userData = getUserData();
        console.log("📝 userData from displayUsername():", userData);
        
        const userNameEl = document.getElementById('user-name');
        if (!userNameEl) {
            console.error("❌ user-name element not found");
            return;
        }
        
        if (userData && userData.username) {
            console.log("✅ Setting username to:", userData.username);
            userNameEl.textContent = userData.username;
        } else {
            console.warn("⚠️ No userData or username found");
        }
    } catch (e) {
        console.error("❌ displayUsername error:", e);
    }
}

function loadDashboardData() {
    try {
        // Get userData from login (don't overwrite!)
        let userData = JSON.parse(localStorage.getItem('userData'));
        
        if (!userData) {
            // Only create default userData if none exists (shouldn't happen after login)
            userData = {
                balance: 0,
                keys: [],
                devices: [],
                transactions: []
            };
            localStorage.setItem('userData', JSON.stringify(userData));
        }
        
        // Don't overwrite! Just use what's there
        console.log("✅ Loaded userData:", userData);
        updateDashboardStats();
    } catch (e) {
        console.error("❌ loadDashboardData error:", e);
    }
}

function updateDashboardStats() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        if (!userData) {
            console.error("❌ No userData in localStorage");
            return;
        }
        
        // Use userData from login response, or fallback to defaults
        const balance = userData.balance || 0;
        const keys = userData.keys || [];
        
        document.getElementById('balance').textContent = balance;
        document.getElementById('topbar-balance').textContent = balance;
        document.getElementById('total-keys').textContent = keys.length;
        
        const expiredKeys = keys.filter(k => new Date(k.expires) < new Date()).length;
        document.getElementById('expired-keys').textContent = expiredKeys;
        
        console.log("✅ Dashboard stats updated:", { balance, totalKeys: keys.length, expiredKeys });
    } catch (e) {
        console.error("❌ updateDashboardStats error:", e);
    }
}

function initializeEventListeners() {
    // Top-up Page Events
    const topupForm = document.getElementById('topup-form');
    if (topupForm) {
        topupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            processTopup();
        });
    }

    // File upload for slip
    const slipUpload = document.getElementById('slip-upload');
    if (slipUpload) {
        slipUpload.addEventListener('change', handleSlipUpload);
    }

    // Clear slip button
    const clearSlipBtn = document.getElementById('clear-slip-btn');
    if (clearSlipBtn) {
        clearSlipBtn.addEventListener('click', clearSlipUpload);
    }

    // Download QR button
    const downloadQRBtn = document.getElementById('download-qr-btn');
    if (downloadQRBtn) {
        downloadQRBtn.addEventListener('click', downloadQR);
    }

    // Buy Device key select
    const keySelect = document.getElementById('key-select');
    if (keySelect) {
        keySelect.addEventListener('change', updateDeviceOptions);
    }

    // Initialize first page as active
    const firstMenuItem = document.querySelector('.menu-item');
    if (firstMenuItem) {
        showDashboardPage('dashboard-main', firstMenuItem);
    }
}

function processTopup() {
    const amount = parseFloat(document.getElementById('topup-amount').value);
    
    if (!amount || amount <= 0) {
        showNotification('กรุณากรอกจำนวนเงินที่ต้องการเติม', 'error');
        return;
    }

    const userData = JSON.parse(localStorage.getItem('userData'));
    userData.balance += amount;
    userData.transactions = userData.transactions || [];
    userData.transactions.push({
        type: 'topup',
        amount: amount,
        dateTime: getCurrentThaiDateISOString()
    });

    localStorage.setItem('userData', JSON.stringify(userData));
    updateDashboardStats();

    showNotification(`เติมเงินสำเร็จ ฿${amount}`, 'success');
    document.getElementById('topup-form').reset();
    document.getElementById('topup-amount').value = '';
    clearSlipUpload();
}

function submitTopUp() {
    processTopup();
}

function handleSlipUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const uploadArea = document.getElementById('slip-upload');
        const previewContainer = document.getElementById('slip-image-container');

        const previewImage = document.getElementById('slip-preview-image');
        previewImage.src = event.target.result;

        uploadArea.style.display = 'none';
        previewContainer.style.display = 'flex';
    };
    reader.readAsDataURL(file);
}

function clearSlipUpload() {
    const uploadArea = document.getElementById('slip-upload');
    const previewContainer = document.getElementById('slip-image-container');

    uploadArea.style.display = 'flex';
    previewContainer.style.display = 'none';
    document.getElementById('slip-file').value = '';
}

function downloadQR() {
    const qrImage = document.querySelector('.qr-image');
    if (!qrImage) return;

    const link = document.createElement('a');
    link.href = qrImage.src;
    link.download = 'QR-Code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('ดาวน์โหลด QR Code สำเร็จ', 'success');
}

// ==================== BUY KEY PAGE ====================
function initBuyKeyPage() {
    // Show all key packages
}

function buyKey(days, price) {
    // Show confirmation before purchase
    const confirmMessage = `คุณแน่ใจหรือไม่ที่จะซื้อ KEY ${days} วัน ราคา ฿${price}?`;
    showConfirmation('ยืนยันการซื้อ KEY VIP', confirmMessage, () => {
        proceedWithKeyPurchase(days, price);
    });
}

function generateKey(days) {
    // Format: HBZ + days (2 digits) + 10 random alphanumeric characters
    // Example: HBZ03xxxxxxxxxx (15 chars total)
    const daysPadded = String(days).padStart(2, '0');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomChars = '';
    for (let i = 0; i < 10; i++) {
        randomChars += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `HBZ${daysPadded}${randomChars}`;
}

function getCurrentThaiDate() {
    // Get current date in Thai timezone (UTC+7)
    const now = new Date();
    // Get browser's timezone offset in milliseconds
    const browserOffsetMs = now.getTimezoneOffset() * 60 * 1000;
    // Thai timezone is UTC+7
    const thaiOffsetMs = 7 * 60 * 60 * 1000;
    // Calculate the correct Thai time
    const thaiTime = new Date(now.getTime() + browserOffsetMs + thaiOffsetMs);
    return thaiTime.toISOString().split('T')[0];
}

function getCurrentThaiDateISOString() {
    // Get current ISO string in Thai timezone (UTC+7)
    const now = new Date();
    // Get browser's timezone offset in milliseconds
    const browserOffsetMs = now.getTimezoneOffset() * 60 * 1000;
    // Thai timezone is UTC+7
    const thaiOffsetMs = 7 * 60 * 60 * 1000;
    // Calculate the correct Thai time
    const thaiTime = new Date(now.getTime() + browserOffsetMs + thaiOffsetMs);
    return thaiTime.toISOString();
}

function proceedWithKeyPurchase(days, price) {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData.balance < price) {
        showNotification('เงินไม่พอ กรุณาเติมเงินเพิ่มเติม', 'error');
        return;
    }

    userData.balance -= price;
    const thaiDateTime = getCurrentThaiDateISOString();
    const keyId = generateKey(days);
    
    // Calculate expiration by adding days while maintaining the same time
    const createdDate = new Date(thaiDateTime);
    const expiresDate = new Date(createdDate.getTime() + days * 24 * 60 * 60 * 1000);
    const expiresDateTime = expiresDate.toISOString();
    
    const newKey = {
        id: keyId,
        days: days,
        created: thaiDateTime,
        expires: expiresDateTime,
        active: true,
        devices: 0,
        maxDevices: 1,
        resetCountdown: 'จันทร์ 08:00 น.',
        usageCount: 1,
        maxUsageCount: 1
    };

    userData.keys.push(newKey);
    userData.transactions = userData.transactions || [];
    userData.transactions.push({
        type: 'buy_key',
        keyId: keyId,
        days: days,
        price: price,
        dateTime: thaiDateTime
    });

    localStorage.setItem('userData', JSON.stringify(userData));
    updateDashboardStats();

    // Show modal with key info
    keyVisibilityState[keyId] = false;
    document.getElementById('modal-key-id').innerHTML = createKeyDisplayWithToggle(keyId);
    document.getElementById('modal-key-created').textContent = formatDate(newKey.created);
    document.getElementById('modal-key-created-time').textContent = formatTime(newKey.created);
    document.getElementById('modal-key-days').textContent = days;
    document.getElementById('modal-key-expires').textContent = formatDate(newKey.expires);
    document.getElementById('modal-key-expires-time').textContent = formatTime(newKey.expires);
    document.getElementById('modal-key-devices').textContent = newKey.maxDevices;
    document.getElementById('key-purchase-modal').style.display = 'flex';

    showNotification(`ซื้อ KEY สำเร็จ ${days} วัน`, 'success');
}

// ==================== BUY DEVICE PAGE ====================
function populateKeySelect() {
    const keySelect = document.getElementById('key-select');
    const userData = JSON.parse(localStorage.getItem('userData'));

    keySelect.innerHTML = '<option value="">-- เลือก KEY ที่ใช้งานอยู่ --</option>';

    userData.keys.forEach(key => {
        const displayKey = formatKeyDisplay(key.id);
        const formattedExpires = `${formatDate(key.expires)} ${formatTime(key.expires)}`;
        const option = document.createElement('option');
        option.value = key.id;
        option.textContent = `${displayKey} (${key.days} วัน - หมดอายุ ${formattedExpires})`;
        keySelect.appendChild(option);
    });
}

function updateDeviceOptions() {
    const keySelect = document.getElementById('key-select');
    const summaryContainer = document.getElementById('device-summary-container');

    if (keySelect.value) {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const selectedKey = userData.keys.find(k => k.id === keySelect.value);

        if (selectedKey) {
            document.getElementById('device-key-summary').textContent = selectedKey.id;
            document.getElementById('device-key-expires').textContent = `${formatDate(selectedKey.expires)} ${formatTime(selectedKey.expires)}`;
            document.getElementById('device-total').textContent = '฿30';
            summaryContainer.style.display = 'block';
        }
    } else {
        summaryContainer.style.display = 'none';
    }
}

function confirmBuyDevice() {
    const keySelect = document.getElementById('key-select');
    const selectedKeyId = keySelect.value;

    if (!selectedKeyId) {
        showNotification('กรุณาเลือก KEY', 'error');
        return;
    }

    const userData = JSON.parse(localStorage.getItem('userData'));
    const key = userData.keys.find(k => k.id === selectedKeyId);
    const price = 30;

    if (userData.balance < price) {
        showNotification('เงินไม่พอ กรุณาเติมเงินเพิ่มเติม', 'error');
        return;
    }

    const confirmModal = document.getElementById('confirmation-modal');
    const confirmTitle = document.getElementById('confirm-title');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmBtn = document.getElementById('confirm-btn');

    confirmTitle.textContent = 'ยืนยันการเพิ่มเครื่องล็อกอิน';
    confirmMessage.innerHTML = `
        <p><strong>KEY:</strong> ${maskKeyId(key.id)}</p>
        <p><strong>ราคา:</strong> ฿${price}</p>
        <p><strong>ยอดเงินคงเหลือ:</strong> ฿${userData.balance - price}</p>
        <p style="margin-top: 15px; color: #ffaa00;">คุณต้องการเพิ่มเครื่องล็อกอินหรือไม่?</p>
    `;
    
    confirmBtn.textContent = 'ยืนยัน';
    confirmBtn.onclick = buyDevice;
    
    confirmModal.style.display = 'flex';
}

function buyDevice() {
    const confirmModal = document.getElementById('confirmation-modal');
    confirmModal.style.display = 'none';

    const keySelect = document.getElementById('key-select');
    const selectedKeyId = keySelect.value;

    if (!selectedKeyId) {
        showNotification('กรุณาเลือก KEY', 'error');
        return;
    }

    const userData = JSON.parse(localStorage.getItem('userData'));
    const price = 30;

    if (userData.balance < price) {
        showNotification('เงินไม่พอ กรุณาเติมเงินเพิ่มเติม', 'error');
        return;
    }

    userData.balance -= price;
    const key = userData.keys.find(k => k.id === selectedKeyId);
    
    if (key) {
        key.devices = (key.devices || 0) + 1;
    }

    const newDevice = {
        id: 'DEVICE' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        keyId: selectedKeyId,
        addedDate: new Date().toISOString().split('T')[0]
    };

    userData.devices.push(newDevice);
    userData.transactions = userData.transactions || [];
    userData.transactions.push({
        type: 'buy_device',
        keyId: selectedKeyId,
        deviceId: newDevice.id,
        price: price,
        dateTime: getCurrentThaiDateISOString()
    });

    localStorage.setItem('userData', JSON.stringify(userData));
    updateDashboardStats();
    displayDeviceHistory();

    showNotification('เพิ่มเครื่องสำเร็จ 1 เครื่อง', 'success');
    keySelect.value = '';
    document.getElementById('device-summary-container').style.display = 'none';
}

function displayDeviceHistory() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const historyTableBody = document.getElementById('device-history-list');

    if (!historyTableBody) return;

    const transactions = userData.transactions || [];
    const deviceTransactions = transactions.filter(t => t.type === 'buy_device');

    if (deviceTransactions.length === 0) {
        historyTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #888;">ยังไม่มีการเพิ่มเครื่องที่บันทึก</td></tr>';
        return;
    }

    historyTableBody.innerHTML = '';
    deviceTransactions.forEach((trans, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(trans.dateTime, true)}</td>
            <td>${trans.keyId}</td>
            <td>฿${trans.price}</td>
            <td><span class="badge success">สำเร็จ</span></td>
            <td>
                <button class="btn btn-small btn-danger" onclick="deleteDeviceHistory(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        historyTableBody.appendChild(row);
    });
}

function deleteDeviceHistory(transactionIndex) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const transactions = userData.transactions || [];
    const deviceTransactions = transactions.filter(t => t.type === 'buy_device');
    
    if (transactionIndex >= 0 && transactionIndex < deviceTransactions.length) {
        const transaction = deviceTransactions[transactionIndex];
        showConfirmation(
            'ลบประวัติการเพิ่มเครื่อง',
            `คุณแน่ใจหรือไม่ที่จะลบประวัติการเพิ่มเครื่องนี้? (${transaction.keyId})`,
            () => {
                // Remove this transaction
                const transIndex = transactions.findIndex(t => 
                    t.type === 'buy_device' && 
                    t.keyId === transaction.keyId && 
                    t.dateTime === transaction.dateTime
                );
                if (transIndex > -1) {
                    transactions.splice(transIndex, 1);
                    userData.transactions = transactions;
                    localStorage.setItem('userData', JSON.stringify(userData));
                    displayDeviceHistory();
                    showNotification('ลบประวัติสำเร็จ', 'success');
                }
            }
        );
    }
}

// ==================== MY KEYS PAGE ====================
function displayKeys() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const keysTableBody = document.getElementById('keys-list');

    if (!keysTableBody) return;

    keysTableBody.innerHTML = '';

    userData.keys.forEach(key => {
        const row = document.createElement('tr');
        const daysRemaining = Math.max(0, Math.floor((new Date(key.expires) - new Date()) / (1000 * 60 * 60 * 24)));
        const status = daysRemaining > 0 ? 'ใช้งานได้' : 'หมดอายุ';
        const statusClass = daysRemaining > 0 ? 'success' : 'error';
        const devices = key.devices || 0;
        const maxDevices = key.maxDevices || 1;

        if (!keyVisibilityState[key.id]) {
            keyVisibilityState[key.id] = false;
        }

        row.innerHTML = `
            <td id="key-cell-${key.id}">${createKeyDisplayWithToggle(key.id)}</td>
            <td>${key.days} วัน</td>
            <td>${devices}/${maxDevices}</td>
            <td>${formatDate(key.expires)}</td>
            <td>${formatTime(key.expires)}</td>
            <td><span class="badge ${statusClass}">${status}</span></td>
            <td style="display: flex; gap: 5px; justify-content: space-between; align-items: center;">
                <button class="btn btn-small btn-secondary" onclick="copyKey('${key.id}')" title="คัดลอก KEY"><i class="fas fa-copy"></i> คัดลอก</button>
                <button class="btn btn-small btn-danger" onclick="deleteKey('${key.id}')" title="ลบ KEY"><i class="fas fa-trash"></i> ลบ</button>
            </td>
        `;

        keysTableBody.appendChild(row);
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('คัดลอก KEY สำเร็จ', 'success');
    });
}

function copyKey(keyId) {
    copyToClipboard(keyId);
}

function deleteKey(keyId) {
    showConfirmation(
        'ลบ KEY',
        `คุณแน่ใจหรือไม่ที่จะลบ KEY ${keyId}? การกระทำนี้ไม่สามารถย้อนกลับได้`,
        () => {
            showPasswordVerification(keyId);
        }
    );
}

// ==================== RENEW KEY PAGE ====================
function populateRenewKeySelect() {
    const renewKeySelect = document.getElementById('select-key');
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!renewKeySelect) return;

    renewKeySelect.innerHTML = '<option value="">-- เลือก KEY --</option>';

    userData.keys.forEach(key => {
        const displayKey = formatKeyDisplay(key.id);
        const formattedExpires = `${formatDate(key.expires)} ${formatTime(key.expires)}`;
        const option = document.createElement('option');
        option.value = key.id;
        option.textContent = `${displayKey} (${key.days} วัน - หมดอายุ ${formattedExpires})`;
        renewKeySelect.appendChild(option);
    });
}

function showRenewKeyInfo() {
    const selectKey = document.getElementById('select-key');
    const selectedKeyId = selectKey.value;
    const infoContainer = document.getElementById('renew-key-info-container');

    if (!selectedKeyId) {
        infoContainer.style.display = 'none';
        return;
    }

    const userData = JSON.parse(localStorage.getItem('userData'));
    const key = userData.keys.find(k => k.id === selectedKeyId);

    if (key) {
        document.getElementById('renew-key-info-id').textContent = key.id;
        document.getElementById('renew-key-info-days').textContent = key.days;
        document.getElementById('renew-key-info-expires').textContent = `${formatDate(key.expires)} ${formatTime(key.expires)}`;
        const devices = key.devices || 0;
        const maxDevices = key.maxDevices || 1;
        document.getElementById('renew-key-info-devices').textContent = `${devices}/${maxDevices}`;
        infoContainer.style.display = 'block';
    }
}

function confirmRenewKey(days, price) {
    const renewKeySelect = document.getElementById('select-key');
    const selectedKeyId = renewKeySelect.value;

    if (!selectedKeyId) {
        showNotification('กรุณาเลือก KEY', 'error');
        return;
    }

    const userData = JSON.parse(localStorage.getItem('userData'));
    const key = userData.keys.find(k => k.id === selectedKeyId);

    if (!key) {
        showNotification('ไม่พบ KEY', 'error');
        return;
    }

    if (userData.balance < price) {
        showNotification('เงินไม่พอ กรุณาเติมเงินเพิ่มเติม', 'error');
        return;
    }

    // Show confirmation with KEY details
    const confirmMessage = `คุณแน่ใจหรือไม่ที่จะต่ออายุ KEY ${key.id} เพิ่ม ${days} วัน ราคา ฿${price}?`;
    showConfirmation('ยืนยันการต่ออายุ KEY', confirmMessage, () => {
        renewKey(selectedKeyId, days, price);
    });
}

function renewKey(selectedKeyId, days, price) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    userData.balance -= price;
    const key = userData.keys.find(k => k.id === selectedKeyId);

    if (key) {
        const currentExpires = new Date(key.expires);
        const newExpires = new Date(currentExpires.getTime() + days * 24 * 60 * 60 * 1000);
        key.expires = newExpires.toISOString();
        key.days += days;

        userData.transactions = userData.transactions || [];
        userData.transactions.push({
            type: 'renew_key',
            keyId: selectedKeyId,
            days: days,
            price: price,
            dateTime: getCurrentThaiDateISOString()
        });

        localStorage.setItem('userData', JSON.stringify(userData));
        updateDashboardStats();
        displayRenewHistory();

        showNotification(`ต่ออายุ KEY สำเร็จ ${days} วัน`, 'success');
        document.getElementById('select-key').value = '';
        document.getElementById('renew-key-info-container').style.display = 'none';
    }
}

function maskKeyId(keyId) {
    if (!keyId || keyId.length < 15) return keyId;
    const first5 = keyId.substring(0, 5);
    const last5 = keyId.substring(10);
    return `${first5}*****${last5}`;
}

function displayRenewHistory() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const historyTableBody = document.getElementById('renew-history-list');

    if (!historyTableBody) return;

    const transactions = userData.transactions || [];
    const renewTransactions = transactions.filter(t => t.type === 'renew_key');

    if (renewTransactions.length === 0) {
        historyTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #888;">ยังไม่มีการต่ออายุ</td></tr>';
        return;
    }

    historyTableBody.innerHTML = '';
    renewTransactions.forEach(trans => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(trans.dateTime, true)}</td>
            <td>${maskKeyId(trans.keyId)}</td>
            <td>${trans.days} วัน</td>
            <td>฿${trans.price}</td>
            <td><span class="badge success">สำเร็จ</span></td>
        `;
        historyTableBody.appendChild(row);
    });
}

// ==================== TOP-UP HISTORY PAGE ====================
function showTopupHistoryTab(tab) {
    const topupTab = document.getElementById('topup-history-topup-tab');
    const purchaseTab = document.getElementById('topup-history-purchase-tab');
    const btnTopupTab = document.getElementById('btn-topup-tab');
    const btnPurchaseTab = document.getElementById('btn-purchase-tab');

    if (tab === 'topup') {
        topupTab.style.display = 'block';
        purchaseTab.style.display = 'none';
        btnTopupTab.style.backgroundColor = 'var(--primary-color)';
        btnTopupTab.style.color = '#000';
        btnPurchaseTab.style.backgroundColor = 'transparent';
        btnPurchaseTab.style.color = 'var(--text-secondary)';
    } else {
        topupTab.style.display = 'none';
        purchaseTab.style.display = 'block';
        btnTopupTab.style.backgroundColor = 'transparent';
        btnTopupTab.style.color = 'var(--text-secondary)';
        btnPurchaseTab.style.backgroundColor = 'var(--primary-color)';
        btnPurchaseTab.style.color = '#000';
    }
}

function displayTopupHistory() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const topupTableBody = document.getElementById('topup-history-topup-list');
    const purchaseTableBody = document.getElementById('topup-history-purchase-list');

    if (!topupTableBody || !purchaseTableBody) return;

    const transactions = userData.transactions || [];
    const topupTransactions = transactions.filter(t => t.type === 'topup');
    const purchaseTransactions = transactions.filter(t => ['buy_key', 'buy_device', 'renew_key'].includes(t.type));

    // Display topup transactions
    if (topupTransactions.length === 0) {
        topupTableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #888;">ยังไม่มีการเติมเงิน</td></tr>';
    } else {
        topupTableBody.innerHTML = '';
        topupTransactions.forEach(trans => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(trans.dateTime, true)}</td>
                <td>+฿${trans.amount}</td>
                <td><span class="badge success">สำเร็จ</span></td>
            `;
            topupTableBody.appendChild(row);
        });
    }

    // Display purchase transactions
    if (purchaseTransactions.length === 0) {
        purchaseTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #888;">ยังไม่มีการซื้อ</td></tr>';
    } else {
        purchaseTableBody.innerHTML = '';
        purchaseTransactions.forEach(trans => {
            const row = document.createElement('tr');
            let description = '';

            if (trans.type === 'buy_key') {
                description = `ซื้อ KEY ${trans.days} วัน`;
            } else if (trans.type === 'buy_device') {
                description = 'เพิ่มเครื่อง (1 เครื่อง)';
            } else if (trans.type === 'renew_key') {
                description = `ต่ออายุ KEY ${trans.days} วัน`;
            }

            row.innerHTML = `
                <td>${formatDate(trans.dateTime, true)}</td>
                <td>${description}</td>
                <td>-฿${trans.price}</td>
                <td><span class="badge success">สำเร็จ</span></td>
            `;
            purchaseTableBody.appendChild(row);
        });
    }
}

// ==================== PROFILE SETTINGS PAGE ====================
function updateProfile() {
    const email = document.getElementById('profile-email').value;

    if (!email) {
        showNotification('กรุณากรอกอีเมลให้ครบ', 'error');
        return;
    }

    const userData = JSON.parse(localStorage.getItem('userData'));
    userData.email = email;
    userData.profile = { email };

    localStorage.setItem('userData', JSON.stringify(userData));
    showNotification('บันทึกข้อมูลสำเร็จ', 'success');
}

function loadProfileData() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const authToken = localStorage.getItem('authToken');
    
    if (!userData || !authToken) {
        console.log('No userData or authToken found');
        return;
    }

    console.log('Loading profile data:', userData);

    // Load username
    if (userData.username) {
        document.getElementById('profile-username').value = userData.username;
    } else if (userData.user && userData.user.username) {
        document.getElementById('profile-username').value = userData.user.username;
    }
    
    // Load email
    if (userData.email) {
        document.getElementById('profile-email').value = userData.email;
    } else if (userData.user && userData.user.email) {
        document.getElementById('profile-email').value = userData.user.email;
    } else if (userData.profile && userData.profile.email) {
        document.getElementById('profile-email').value = userData.profile.email;
    }
}

function changePassword() {
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!oldPassword || !newPassword || !confirmPassword) {
        showNotification('กรุณากรอกรหัสผ่านให้ครบ', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showNotification('รหัสผ่านใหม่ไม่ตรงกัน', 'error');
        return;
    }

    showNotification('เปลี่ยนรหัสผ่านสำเร็จ', 'success');
    document.getElementById('old-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

function logout() {
    showConfirmation(
        'ออกจากระบบ',
        'คุณแน่ใจหรือไม่ที่จะออกจากระบบ?',
        () => {
            // ลบข้อมูลออก
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            localStorage.removeItem('userData');
            
            // กลับไปหน้า login
            window.location.href = './index.html';
        }
    );
}

// ==================== DOWNLOAD PAGE ====================

// Cache for download links
let downloadLinksCache = null;

// Load download links from Google Sheet
async function loadDownloadLinks() {
  try {
    if (downloadLinksCache) {
      return downloadLinksCache;
    }
    
    const result = await apiGetDownloadLinks();
    if (result.success && result.downloads) {
      downloadLinksCache = result.downloads;
      console.log('Download links loaded:', downloadLinksCache);
      return result.downloads;
    } else {
      console.error('Failed to load download links:', result.message);
      return null;
    }
  } catch (e) {
    console.error('Error loading download links:', e);
    return null;
  }
}

function downloadFile(fileType) {
  (async () => {
    try {
      console.log('Download clicked for:', fileType);
      
      // Show loading modal if available
      if (typeof showLoadingModal === 'function') {
        showLoadingModal();
      }
      
      // Wait 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const links = await loadDownloadLinks();
      
      // Hide loading modal if available
      if (typeof hideLoadingModal === 'function') {
        hideLoadingModal();
      }
      
      if (!links) {
        console.error('No download links returned');
        showNotification('ไม่สามารถโหลดลิงก์ดาวน์โหลด', 'error');
        return;
      }

      // Map file types to download links
      let downloadUrl = null;
      let fileName = '';

      // Android downloads
      if (fileType === 'vphonegaga') {
        downloadUrl = links.android.vphonegaga;
        fileName = 'Vphonegaga';
      } else if (fileType === 'mod-menu-free') {
        downloadUrl = links.android.modMenuFree;
        fileName = 'Mod Menu ฟรี';
      } else if (fileType === 'mod-menu-mobile') {
        downloadUrl = links.android.modMenuVip;
        fileName = 'Mod Menu VIP';
      } else if (fileType === 'game-32bit') {
        downloadUrl = links.android.game32bit;
        fileName = 'ตัวเกม 32Bit';
      } else if (fileType === 'mt-manager') {
        downloadUrl = links.android.mtManager;
        fileName = 'MT manager';
      }
      // PC downloads
      else if (fileType === 'mumu12') {
        downloadUrl = links.pc.mumu12;
        fileName = 'MuMu12';
      } else if (fileType === 'mod-menu-free-pc') {
        downloadUrl = links.pc.modMenuFree;
        fileName = 'Mod Menu ฟรี';
      } else if (fileType === 'mod-menu-pc') {
        downloadUrl = links.pc.modMenuVip;
        fileName = 'Mod Menu VIP';
      } else if (fileType === 'game-32bit-pc') {
        downloadUrl = links.pc.game32bit;
        fileName = 'ตัวเกม 32Bit';
      } else if (fileType === 'mt-manager-pc') {
        downloadUrl = links.pc.mtManager;
        fileName = 'MT manager';
      }

      console.log('Download URL:', downloadUrl, 'File:', fileName);
      
      if (downloadUrl && downloadUrl.trim()) {
        // Open download link in new window
        window.open(downloadUrl, '_blank');
        showNotification(`เริ่มดาวน์โหลด ${fileName}`, 'success');
      } else {
        console.error('Download URL is empty');
        showNotification('ลิงก์ดาวน์โหลดไม่พร้อมใช้งาน', 'error');
      }
    } catch (e) {
      console.error('Error in downloadFile:', e);
      if (typeof hideLoadingModal === 'function') {
        hideLoadingModal();
      }
      showNotification('เกิดข้อผิดพลาด: ' + e.message, 'error');
    }
  })();
}

function downloadApp(platform) {
    // Download URL mapping for different platforms
    const downloadLinks = {
        windows: 'https://example.com/download/hbzxlrg-windows.exe',
        macos: 'https://example.com/download/hbzxlrg-macos.dmg',
        linux: 'https://example.com/download/hbzxlrg-linux.tar.gz',
        android: 'https://example.com/download/hbzxlrg-android.apk',
        ios: 'https://example.com/download/hbzxlrg-ios.ipa'
    };

    const platformNames = {
        windows: 'Windows',
        macos: 'macOS',
        linux: 'Linux',
        android: 'Android',
        ios: 'iOS'
    };

    const link = downloadLinks[platform];
    if (link) {
        // Create a temporary link element and trigger download
        const a = document.createElement('a');
        a.href = link;
        a.download = true;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showNotification(`เริ่มดาวโหลด ${platformNames[platform]}`, 'success');
    } else {
        showNotification('ไม่พบลิงก์ดาวโหลด', 'error');
    }
}

// ==================== RESET UID PAGE ====================
function populateResetUIDKeySelect() {
    const resetUIDKeySelect = document.getElementById('reset-uid-key');
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!resetUIDKeySelect) return;

    resetUIDKeySelect.innerHTML = '<option value="">-- เลือก KEY --</option>';

    userData.keys.forEach(key => {
        // Only show keys that haven't expired
        const expiresDate = new Date(key.expires);
        const now = new Date();
        if (expiresDate > now) {
            const displayKey = formatKeyDisplay(key.id);
            const option = document.createElement('option');
            option.value = key.id;
            option.textContent = displayKey;
            resetUIDKeySelect.appendChild(option);
        }
    });

    // Add change listener
    resetUIDKeySelect.addEventListener('change', () => {
        const selectedKeyId = resetUIDKeySelect.value;
        if (selectedKeyId) {
            showResetUIDInfo(selectedKeyId);
        } else {
            document.getElementById('reset-uid-info-box').style.display = 'none';
            document.getElementById('reset-uid-btn').style.display = 'none';
            document.getElementById('reset-uid-disabled-btn').style.display = 'none';
        }
    });
}

function showResetUIDInfo(keyId) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const key = userData.keys.find(k => k.id === keyId);
    
    if (!key) return;

    // Display key information
    const keyInfoContainer = document.getElementById('reset-uid-key-info-container');
    document.getElementById('reset-uid-key-info-id').textContent = key.id;
    document.getElementById('reset-uid-key-info-days').textContent = key.days;
    document.getElementById('reset-uid-key-info-expires').textContent = `${formatDate(key.expires)} ${formatTime(key.expires)}`;
    const devices = key.devices || 0;
    const maxDevices = key.maxDevices || 1;
    document.getElementById('reset-uid-key-info-devices').textContent = `${devices}/${maxDevices}`;
    keyInfoContainer.style.display = 'block';

    const infoBox = document.getElementById('reset-uid-info-box');
    const resetBtn = document.getElementById('reset-uid-btn');
    const disabledBtn = document.getElementById('reset-uid-disabled-btn');

    // Generate UID for this key
    const keyUID = 'UID-' + key.id + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Get reset countdown
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday
    const nextMonday = new Date(today);
    
    if (dayOfWeek === 1 && today.getHours() >= 8) {
        // Today is Monday after 08:00 - next reset on next Monday
        nextMonday.setDate(today.getDate() + 7);
    } else if (dayOfWeek === 1 && today.getHours() < 8) {
        // Today is Monday before 08:00 - can reset today
    } else if (dayOfWeek === 0) {
        // Today is Sunday - next reset tomorrow (Monday)
        nextMonday.setDate(today.getDate() + 1);
    } else {
        // Other days - next reset on next Monday
        const daysUntilMonday = (1 - dayOfWeek + 7) % 7;
        nextMonday.setDate(today.getDate() + daysUntilMonday);
    }

    nextMonday.setHours(8, 0, 0, 0);

    // Check if can reset
    const canReset = (dayOfWeek === 1 && today.getHours() >= 8) ? false : true;
    const nextResetText = formatDate(nextMonday, false) + ' 08:00:00 น.';

    document.getElementById('reset-uid-current').textContent = keyUID;
    document.getElementById('reset-uid-usage-count').textContent = `${key.usageCount}/${key.maxUsageCount}`;
    document.getElementById('reset-uid-next-reset').textContent = nextResetText;

    infoBox.style.display = 'block';
    
    if (canReset) {
        resetBtn.style.display = 'block';
        disabledBtn.style.display = 'none';
        resetBtn.onclick = () => performResetUID(keyId);
    } else {
        resetBtn.style.display = 'none';
        disabledBtn.style.display = 'block';
        disabledBtn.textContent = `รอบถัดไป: ${nextResetText}`;
    }
}

function performResetUID(keyId) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const key = userData.keys.find(k => k.id === keyId);

    if (!key) {
        showNotification('ไม่พบ KEY', 'error');
        return;
    }

    showConfirmation(
        'รีเซ็ต UID',
        `คุณแน่ใจหรือไม่ที่จะรีเซ็ต UID ของ ${keyId}? การกระทำนี้ไม่สามารถย้อนกลับได้`,
        () => {
            // Reset the key's usage counter
            key.usageCount = 0;
            key.maxUsageCount = 1;
            key.uid = 'UID-' + key.id + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            
            userData.transactions = userData.transactions || [];
            userData.transactions.push({
                type: 'reset_uid',
                keyId: keyId,
                dateTime: getCurrentThaiDateISOString()
            });

            localStorage.setItem('userData', JSON.stringify(userData));
            showNotification('รีเซ็ต UID สำเร็จ จะสามารถใช้ได้อีกครั้งในจันทร์ 08:00 น.', 'success');
            displayResetUIDHistory();
            
            // Update the display immediately to show 0/1
            document.getElementById('reset-uid-usage-count').textContent = `${key.usageCount}/${key.maxUsageCount}`;
            
            // Reset the form
            document.getElementById('reset-uid-key').value = '';
            document.getElementById('reset-uid-info-box').style.display = 'none';
            document.getElementById('reset-uid-btn').style.display = 'none';
        }
    );
}

function displayResetUIDHistory() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const historyTableBody = document.getElementById('reset-uid-history-list');

    if (!historyTableBody) return;

    const transactions = userData.transactions || [];
    const resetTransactions = transactions.filter(t => t.type === 'reset_uid');

    if (resetTransactions.length === 0) {
        historyTableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #888;">ยังไม่มีการรีเซ็ต UID</td></tr>';
    } else {
        historyTableBody.innerHTML = '';
        resetTransactions.forEach(trans => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(trans.dateTime, true)}</td>
                <td>${maskKeyId(trans.keyId)}</td>
                <td><span class="badge success">สำเร็จ</span></td>
            `;
            historyTableBody.appendChild(row);
        });
    }
}

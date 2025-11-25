// Admin Panel JavaScript
let allUsers = [];
let currentEditUserId = null;
let pageLoaded = false;
const LOADING_DURATION = 2000; // 2 seconds

// Page constants
const PAGE_IDS = {
    main: 'admin-main',
    users: 'users-page'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Only run once
    if (pageLoaded) return;
    pageLoaded = true;
    
    checkAdminStatus();
    loadUsers();
    initializeEventListeners();
});

// Check if user is admin
function checkAdminStatus() {
    // Get admin credentials from localStorage
    const adminUsername = localStorage.getItem('adminUsername');
    const adminPassword = localStorage.getItem('adminPassword');
    
    // If no admin credentials, they're not an admin
    if (!adminUsername || !adminPassword) {
        alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        window.location.href = './index.html';
        return;
    }
    
    // Set topbar user
    const username = localStorage.getItem('username') || adminUsername;
    const topbarUser = document.getElementById('topbar-user');
    if (topbarUser) {
        topbarUser.textContent = username;
    }
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        
        // Update margin on main-content for desktop
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            const isCollapsed = sidebar.classList.contains('collapsed');
            if (window.innerWidth > 768) {
                mainContent.style.marginLeft = isCollapsed ? '70px' : '280px';
            }
        }
    }
}

// Load users from Apps Script
async function loadUsers() {
    try {
        showLoadingModal();
        
        const adminUsername = localStorage.getItem('adminUsername');
        const adminPassword = localStorage.getItem('adminPassword');
        
        if (!adminUsername || !adminPassword) {
            showAlert('ข้อมูลการเข้าสู่ระบบหายไป กรุณาล็อกอินใหม่', 'error');
            window.location.href = './index.html';
            return;
        }
        
        // Call config.js API (which calls Apps Script)
        const result = await callAppsScript('getAllUsers', {
            adminUsername: adminUsername,
            adminPassword: adminPassword
        });
        
        setTimeout(() => {
            hideLoadingModal();
            
            if (result.success && result.users) {
                allUsers = result.users;
                renderUsersTable();
                updateStats();
                showAlert('โหลดข้อมูลผู้ใช้สำเร็จ', 'success');
            } else {
                showAlert(result.message || 'ไม่สามารถโหลดข้อมูลผู้ใช้', 'error');
            }
        }, LOADING_DURATION);
    } catch (error) {
        hideLoadingModal();
        console.error('Error loading users:', error);
        showAlert('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
    }
}

// Render users table
function renderUsersTable() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;
    
    if (allUsers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--text-muted);">
                    ไม่พบผู้ใช้
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = allUsers.map((user, index) => `
        <tr>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>฿${parseFloat(user.balance).toFixed(2)}</td>
            <td>
                <span class="status-badge" style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background: var(--primary-color); color: white;">
                    ใช้งาน
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-edit" data-user-id="${user.id}" data-username="${user.username}" data-email="${user.email}" data-balance="${user.balance}">
                        <i class="fas fa-edit"></i> แก้ไข
                    </button>
                    <button class="action-btn btn-delete" data-user-id="${user.id}" data-username="${user.username}">
                        <i class="fas fa-trash"></i> ลบ
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Update stats
function updateStats() {
    const totalUsers = document.getElementById('total-users');
    const totalBalance = document.getElementById('total-balance');
    
    if (totalUsers) {
        totalUsers.textContent = allUsers.length;
    }
    
    if (totalBalance && allUsers.length > 0) {
        const sum = allUsers.reduce((acc, user) => acc + parseFloat(user.balance), 0);
        totalBalance.textContent = sum.toLocaleString('th-TH', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    }
}

// Filter table
function filterTable() {
    const searchInput = document.getElementById('search-input') || document.getElementById('search-input-users');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;
    
    const rows = tableBody.getElementsByTagName('tr');
    Array.from(rows).forEach(row => {
        const username = row.cells[0]?.textContent || '';
        const email = row.cells[1]?.textContent || '';
        
        const matches = username.toLowerCase().includes(searchTerm) || 
                       email.toLowerCase().includes(searchTerm);
        row.style.display = matches ? '' : 'none';
    });
}

// Open edit modal
function openEditModal(userId, username, email, balance) {
    currentEditUserId = userId;
    document.getElementById('edit-username').value = username;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-password').value = '';
    document.getElementById('edit-balance').value = balance;
    
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    currentEditUserId = null;
}

// Save user data
async function saveUserData() {
    const username = document.getElementById('edit-username').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const password = document.getElementById('edit-password').value.trim();
    const balance = parseFloat(document.getElementById('edit-balance').value);
    
    // Validate
    if (!username || !email) {
        showAlert('กรุณากรอกชื่อผู้ใช้และอีเมล', 'error');
        return;
    }
    
    if (isNaN(balance) || balance < 0) {
        showAlert('กรุณากรอกยอดคงเหลือที่ถูกต้อง', 'error');
        return;
    }
    
    try {
        showLoadingModal();
        
        const adminUsername = localStorage.getItem('adminUsername');
        const adminPassword = localStorage.getItem('adminPassword');
        
        const updateData = {
            username: username,
            email: email,
            balance: balance
        };
        
        if (password) {
            updateData.password = password;
        }
        
        // Call Apps Script API using config.js
        const result = await callAppsScript('updateUser', {
            adminUsername: adminUsername,
            adminPassword: adminPassword,
            userId: currentEditUserId,
            updates: updateData
        });
        
        setTimeout(() => {
            hideLoadingModal();
            
            if (result.success) {
                showAlert('อัพเดตข้อมูลผู้ใช้สำเร็จ', 'success');
                
                // Update the user in allUsers array
                const userIndex = allUsers.findIndex(u => u.id === currentEditUserId);
                if (userIndex !== -1) {
                    allUsers[userIndex] = {
                        ...allUsers[userIndex],
                        username: updateData.username,
                        email: updateData.email,
                        balance: updateData.balance
                    };
                }
                
                closeEditModal();
                // Only re-render the table without full page reload
                renderUsersTable();
                updateStats();
            } else {
                showAlert(result.message || 'เกิดข้อผิดพลาด', 'error');
            }
        }, LOADING_DURATION);
    } catch (error) {
        hideLoadingModal();
        console.error('Error saving user data:', error);
        showAlert('เกิดข้อผิดพลาดในการบันทึก', 'error');
    }
}

// Delete user
async function deleteUser(userId, username) {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ "${username}"?`)) {
        return;
    }
    
    try {
        showLoadingModal();
        
        const adminUsername = localStorage.getItem('adminUsername');
        const adminPassword = localStorage.getItem('adminPassword');
        
        // Call Apps Script API using config.js
        const result = await callAppsScript('deleteUser', {
            adminUsername: adminUsername,
            adminPassword: adminPassword,
            userId: userId
        });
        
        setTimeout(() => {
            hideLoadingModal();
            
            if (result.success) {
                showAlert('ลบผู้ใช้สำเร็จ', 'success');
                // Remove user from allUsers array
                allUsers = allUsers.filter(u => u.id !== userId);
                // Only re-render the table without full page reload
                renderUsersTable();
                updateStats();
            } else {
                showAlert(result.message || 'เกิดข้อผิดพลาด', 'error');
            }
        }, LOADING_DURATION);
    } catch (error) {
        hideLoadingModal();
        console.error('Error deleting user:', error);
        showAlert('เกิดข้อผิดพลาดในการลบ', 'error');
    }
}

// Show alert
function showAlert(message, type = 'info') {
    const alertDiv = document.getElementById('alert');
    if (!alertDiv) return;
    
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.display = 'block';
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 3000);
}

// Show loading modal
function showLoadingModal() {
    const loadingModal = document.getElementById('loading-modal');
    if (loadingModal) {
        loadingModal.style.display = 'flex';
    }
}

// Hide loading modal
function hideLoadingModal() {
    const loadingModal = document.getElementById('loading-modal');
    if (loadingModal) {
        loadingModal.style.display = 'none';
    }
}

// Logout
function logout() {
    if (confirm('คุณแน่ใจหรือไม่ที่จะออกจากระบบ?')) {
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('adminPassword');
        window.location.href = './index.html';
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Close modal when clicking outside
    const editModal = document.getElementById('edit-modal');
    if (editModal) {
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                closeEditModal();
            }
        });
    }
    
    // Prevent form submission and page reload
    const editForm = document.getElementById('edit-form');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            return false;
        });
    }
    
    // Add event delegation for table buttons
    const tableBody = document.getElementById('users-table-body');
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.btn-edit');
            const deleteBtn = e.target.closest('.btn-delete');
            
            if (editBtn) {
                const userId = editBtn.dataset.userId;
                const username = editBtn.dataset.username;
                const email = editBtn.dataset.email;
                const balance = editBtn.dataset.balance;
                openEditModal(userId, username, email, parseFloat(balance));
            }
            
            if (deleteBtn) {
                const userId = deleteBtn.dataset.userId;
                const username = deleteBtn.dataset.username;
                deleteUser(userId, username);
            }
        });
    }
    
    // Handle sidebar toggle on mobile
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.setAttribute('title', 'Toggle Sidebar');
    }
}

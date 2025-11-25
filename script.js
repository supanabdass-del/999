// ==================== APPS SCRIPT AUTHENTICATION ====================
// Updated to use Apps Script instead of Node.js backend

// Show Loading Modal
function showLoadingModal(text = 'กำลังประมวลผล...') {
    document.getElementById('loading-text').textContent = text;
    document.getElementById('loading-modal').style.display = 'flex';
}

// Hide Loading Modal
function hideLoadingModal() {
    document.getElementById('loading-modal').style.display = 'none';
}

// Show Success Modal
function showSuccessModal(title, message, onClose) {
    document.getElementById('success-title').textContent = title;
    // Use innerHTML to support <br> tags and line breaks
    document.getElementById('success-message').innerHTML = message.replace(/\n/g, '<br>');
    document.getElementById('success-modal').style.display = 'flex';
    window.onCloseSuccess = onClose;
}

// Close Success Modal
function closeSuccessModal() {
    document.getElementById('success-modal').style.display = 'none';
    if (window.onCloseSuccess) {
        window.onCloseSuccess();
    }
}

// Show Error Modal
function showErrorModal(title, message) {
    document.getElementById('error-title').textContent = title;
    // Use innerHTML to support <br> tags and line breaks
    document.getElementById('error-message').innerHTML = message.replace(/\n/g, '<br>');
    document.getElementById('error-modal').style.display = 'flex';
}

// Close Error Modal
function closeErrorModal() {
    document.getElementById('error-modal').style.display = 'none';
}

// Toggle Password Visibility
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = event.target.closest('.toggle-password');
    
    if (!passwordInput || !toggleButton) return;
    
    const toggleIcon = toggleButton.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        if (toggleIcon) {
            toggleIcon.className = 'fas fa-eye-slash';
        }
        toggleButton.classList.add('active');
    } else {
        passwordInput.type = 'password';
        if (toggleIcon) {
            toggleIcon.className = 'fas fa-eye';
        }
        toggleButton.classList.remove('active');
    }
}

// Show Message Function
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        element.style.display = 'block';
    }
}

// Show/Hide Page
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
    }
}

// ==================== FORM HANDLERS ====================
// Initialize forms when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get all form elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const resetPasswordForm = document.getElementById('reset-password-form');
    const changePasswordForm = document.getElementById('change-password-form');
    
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');
    const rememberCheckbox = document.getElementById('remember-password');
    
    // Load saved username and password if "Remember me" was checked
    const savedUsername = localStorage.getItem('savedUsername');
    const savedPassword = localStorage.getItem('savedPassword');
    const isSaved = localStorage.getItem('isSavedPassword');
    
    if (savedUsername && savedPassword && isSaved === 'true') {
        if (loginUsername) loginUsername.value = savedUsername;
        if (loginPassword) loginPassword.value = savedPassword;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
    
    // Attach event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', handleResetPassword);
    }
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handleChangePassword);
    }
});

// ==================== LOGIN HANDLER ====================
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const rememberPassword = document.getElementById('remember-password').checked;
    
    if (!username || !password) {
        showMessage('login-message', 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน', 'error');
        return;
    }
    
    showLoadingModal('กำลังเข้าสู่ระบบ...');
    
    try {
        // Call Apps Script API via config.js
        const result = await apiLogin(username, password);
        
        if (result.success && result.token) {
            // Save token and user data
            saveToken(result.token);
            saveUserData({
                username: result.username,
                email: result.email,
                userId: result.userId,
                balance: result.balance,
                role: result.role
            });
            
            // Check if user is admin and save admin credentials
            if (isCurrentUserAdmin()) {
                localStorage.setItem('adminUsername', username);
                localStorage.setItem('adminPassword', password);
            }
            
            // Handle "Remember me" checkbox
            if (rememberPassword) {
                localStorage.setItem('savedUsername', username);
                localStorage.setItem('savedPassword', password);
                localStorage.setItem('isSavedPassword', 'true');
            } else {
                localStorage.removeItem('savedUsername');
                localStorage.removeItem('savedPassword');
                localStorage.removeItem('isSavedPassword');
            }
            
            showMessage('login-message', 'เข้าสู่ระบบสำเร็จ!', 'success');
            
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = './dashboard.html';
            }, 1000);
        } else {
            hideLoadingModal();
            showErrorModal('เข้าสู่ระบบล้มเหลว', result.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }
    } catch (error) {
        console.error('Login error:', error);
        hideLoadingModal();
        showErrorModal('เข้าสู่ระบบล้มเหลว', 'ไม่สามารถเชื่อมต่อกับ Apps Script');
    }
}

// ==================== SIGNUP HANDLER ====================
async function handleSignup(e) {
    e.preventDefault();
    
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const confirmPassword = document.getElementById('signup-confirm-password').value.trim();
    
    if (!username || !email || !password || !confirmPassword) {
        showErrorModal('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }
    
    if (password !== confirmPassword) {
        showErrorModal('รหัสผ่านไม่ตรงกัน', 'กรุณากรอกรหัสผ่านให้ตรงกัน');
        return;
    }
    
    if (password.length < 6) {
        showErrorModal('รหัสผ่านสั้นเกินไป', 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
        return;
    }
    
    showLoadingModal('กำลังสมัครสมาชิก...');
    
    try {
        // Call Apps Script API via config.js
        const result = await apiSignup(username, email, password, confirmPassword);
        
        if (result.success && result.token) {
            // Save token and user data
            saveToken(result.token);
            saveUserData({
                username: result.username,
                email: result.email,
                userId: result.userId,
                balance: result.balance || 0,
                role: result.role || 'user'
            });
            
            hideLoadingModal();
            showSuccessModal(
                'สมัครสมาชิกสำเร็จ!',
                'ยินดีต้อนรับสู่ระบบ',
                () => {
                    window.location.href = './dashboard.html';
                }
            );
        } else {
            hideLoadingModal();
            showErrorModal('เกิดข้อผิดพลาด', result.message || 'ไม่สามารถสมัครสมาชิกได้');
        }
    } catch (error) {
        console.error('Signup error:', error);
        hideLoadingModal();
        showErrorModal('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับ Apps Script');
    }
}

// ==================== FORGOT PASSWORD HANDLER ====================
async function handleForgotPassword(e) {
    e.preventDefault();
    
    const username = document.getElementById('forgot-username').value.trim();
    const email = document.getElementById('forgot-email').value.trim();

    if (!username || !email) {
        showMessage('forgot-password-message', 'กรุณากรอกชื่อผู้ใช้และอีเมล', 'error');
        return;
    }

    showLoadingModal('กำลังประมวลผล...');

    try {
        // Call Apps Script API via config.js (username + email)
        const result = await apiForgotPassword(username, email);

        if (result.success) {
            hideLoadingModal();
            showSuccessModal(
                'Reset token ถูกสร้าง',
                `Reset Token:\n${result.resetToken}`,
                () => {
                    // Go to reset page and prefill token
                    showPage('reset-password-page');
                    document.getElementById('forgot-username').value = '';
                    document.getElementById('forgot-email').value = '';
                    document.getElementById('reset-token').value = result.resetToken || '';
                }
            );
        } else {
            hideLoadingModal();
            showErrorModal('ไม่สำเร็จ', result.message || 'ไม่พบบัญชีที่ตรงกัน');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        hideLoadingModal();
        showErrorModal('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับ Apps Script');
    }
}

// ==================== RESET PASSWORD HANDLER (Step 2) ====================
async function handleResetPassword(e) {
    e.preventDefault();
    
    const resetToken = document.getElementById('reset-token').value.trim();
    const newPassword = document.getElementById('reset-new-password').value.trim();
    const confirmPassword = document.getElementById('reset-confirm-password').value.trim();
    
    if (!resetToken || !newPassword || !confirmPassword) {
        showErrorModal('ข้อมูลไม่ครบ', 'กรุณากรอกข้อมูลให้ครบ');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showErrorModal('รหัสผ่านไม่ตรงกัน', 'กรุณากรอกรหัสผ่านให้ตรงกัน');
        return;
    }
    
    if (newPassword.length < 8) {
        showErrorModal('รหัสผ่านสั้นเกินไป', 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
        return;
    }
    
    showLoadingModal('กำลังตั้งรหัสผ่านใหม่...');
    
    try {
        const result = await apiResetPassword(resetToken, newPassword);
        
        if (result.success) {
            hideLoadingModal();
            showSuccessModal(
                'ตั้งรหัสผ่านสำเร็จ!',
                'รหัสผ่านของคุณได้รับการเปลี่ยนแปลงแล้ว',
                () => {
                    showPage('login-page');
                    document.getElementById('reset-token').value = '';
                    document.getElementById('reset-new-password').value = '';
                    document.getElementById('reset-confirm-password').value = '';
                }
            );
        } else {
            hideLoadingModal();
            showErrorModal('ตั้งรหัสผ่านล้มเหลว', result.message || 'ไม่สามารถตั้งรหัสผ่านใหม่ได้');
        }
    } catch (error) {
        console.error('Reset password error:', error);
        hideLoadingModal();
        showErrorModal('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับ Apps Script');
    }
}

// ==================== CHANGE PASSWORD HANDLER ====================
async function handleChangePassword(e) {
    e.preventDefault();
    
    const oldPassword = document.getElementById('old-password')?.value.trim() || '';
    const newPassword = document.getElementById('new-password').value.trim();
    const confirmNewPassword = document.getElementById('confirm-new-password').value.trim();
    
    if (!newPassword || !confirmNewPassword || !oldPassword) {
        showMessage('change-password-message', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        showMessage('change-password-message', 'รหัสผ่านไม่ตรงกัน', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showMessage('change-password-message', 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'error');
        return;
    }
    
    showMessage('change-password-message', 'กำลังเปลี่ยนรหัสผ่าน...', 'success');
    
    try {
        // Get username from localStorage
        const username = getUserData()?.username;
        
        if (!username) {
            showMessage('change-password-message', 'ไม่พบข้อมูลผู้ใช้', 'error');
            return;
        }
        
        // Call Apps Script API via config.js
        const result = await apiChangePassword(username, oldPassword, newPassword);
        
        if (result.success) {
            showMessage('change-password-message', 'เปลี่ยนรหัสผ่านสำเร็จ!', 'success');
            
            // Clear fields and redirect to login
            setTimeout(() => {
                document.getElementById('change-password-form').reset();
                clearToken();
                window.location.href = './index.html';
            }, 1500);
        } else {
            showMessage('change-password-message', result.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้', 'error');
        }
    } catch (error) {
        console.error('Change password error:', error);
        showMessage('change-password-message', 'เกิดข้อผิดพลาด', 'error');
    }
}

// ==================== END OF FORM HANDLERS ====================
// Note: Requires config.js to be included in HTML before this script

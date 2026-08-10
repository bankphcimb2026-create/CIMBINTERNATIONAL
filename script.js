// ========== GLOBAL VARIABLES ==========
let currentUser = null;
let isLoggedIn = false;
let transferData = {};
let activationVerified = true; // Ginawang true para laktawan ang activation step

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkAuthStatus();
});

function setupEventListeners() {
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
}

function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        showLoggedInUI();
        showSection('dashboard');
    }
}

// ========== UI TRANSITIONS / TOGGLES ==========
function toggleSignup() {
    const loginSec = document.getElementById('loginSection');
    const signupSec = document.getElementById('signupSection');
    
    if (loginSec.style.display === 'none') {
        loginSec.style.display = 'block';
        signupSec.style.display = 'none';
    } else {
        loginSec.style.display = 'none';
        signupSec.style.display = 'block';
    }
}

function toggleForgotPassword() {
    const loginSec = document.getElementById('loginSection');
    const forgotSec = document.getElementById('forgotPasswordSection');
    
    if (loginSec.style.display === 'none') {
        loginSec.style.display = 'block';
        forgotSec.style.display = 'none';
    } else {
        loginSec.style.display = 'none';
        forgotSec.style.display = 'block';
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('navbarMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}
// ========== AUTHENTICATION ==========
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    // Kahit anong credentials, ito ang gagamiting premium profile para sa iisang dashboard screen
    currentUser = {
        id: 1,
        name: 'Branko Milos',
        username: username,
        email: 'branko.milos@email.com',
        phone: '+385 1 234 5678',
        accountType: 'Premium',
        lastLogin: new Date().toLocaleString(),
        savingsBalance: 34378.25
    };

    isLoggedIn = true;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showNotification('Login successful!', 'success');

    setTimeout(() => {
        showLoggedInUI();
        showSection('dashboard');
    }, 1000);
}

function handleSignup(event) {
    event.preventDefault();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Standard checking pa rin para sa password flow bago dumeretso
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    // Kahit anong inputs ang gawin sa pagre-register, dideretso pa rin kay Branko Milos sa dashboard
    currentUser = {
        id: 1,
        name: 'Branko Milos',
        username: 'branko.milos',
        email: 'branko.milos@email.com',
        phone: '+385 1 234 5678',
        accountType: 'Premium',
        lastLogin: new Date().toLocaleString(),
        savingsBalance: 34378.25
    };

    isLoggedIn = true;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showNotification('Account created successfully!', 'success');

    // REKTA SA DASHBOARD (Nilaktawan na ang activation verification screen)
    setTimeout(() => {
        showLoggedInUI();
        showSection('dashboard');
    }, 1000);
}

function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('resetEmail').value;
    showNotification('Password reset link sent to ' + email, 'success');
    toggleForgotPassword();
}

function logout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('activationVerified');
    showNotification('Logged out successfully', 'success');

    setTimeout(() => {
        location.reload();
    }, 1000);
}
// ========== UI TRANSITIONS ==========
function showLoggedInUI() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('signupSection').style.display = 'none';
    document.getElementById('forgotPasswordSection').style.display = 'none';
    if (document.getElementById('activationSection')) {
        document.getElementById('activationSection').style.display = 'none';
    }
    document.getElementById('navbar').style.display = 'block';

    if (currentUser) {
        const userNameEl = document.getElementById('userName');
        if (userNameEl) userNameEl.textContent = currentUser.name;
    }
}

function showSection(sectionId) {
    const sections = ['dashboard', 'accounts', 'transfers', 'settings'];
    sections.forEach(sec => {
        const el = document.getElementById(sec + 'Section');
        if (el) el.style.display = 'none';
    });

    const target = document.getElementById(sectionId + 'Section');
    if (target) {
        target.style.display = 'block';
    }
    
    // Paglipat sa dashboard, i-refresh ang logs at transactions
    if (sectionId === 'dashboard') {
        initializeDashboard();
        loadTransactions();
    }
    
    // Tawagin ang log page feature analytics
    logPageView(sectionId);
}

// ========== UTILITY FUNCTIONS ==========
function formatCurrency(amount) {
    return '€ ' + parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message, type) {
    alert(type.toUpperCase() + ': ' + message);
}

// ========== ADDITIONAL FEATURES ==========
function addEventListenersToModals() {
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', addEventListenersToModals);

// ========== SEARCH FUNCTIONALITY ==========
function searchTransactions(query) {
    const rows = document.querySelectorAll('.transactions-table tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
    });
}
// ========== DATE AND TIME ==========
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return now.toLocaleDateString('en-US', options);
}

function initializeDashboard() {
    const lastLogin = document.getElementById('lastLogin');
    if (lastLogin && currentUser) {
        lastLogin.textContent = 'Last login: Today at ' + new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

// ========== LOAD TRANSACTIONS ==========
function loadTransactions() {
    const tbody = document.querySelector('.transactions-table tbody');
    if (!tbody) return;
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    tbody.innerHTML = '';
    
    if (transactions.length === 0) {
        const initialTransaction = {
            date: '2026-07-05',
            description: 'Initial Deposit',
            type: 'Credit',
            amount: '+34,378.25',
            status: 'Completed'
        };
        tbody.innerHTML += `
            <tr>
                <td>${initialTransaction.date}</td>
                <td>${initialTransaction.description}</td>
                <td><span class="badge badge-credit">Credit</span></td>
                <td class="amount-credit">${initialTransaction.amount}</td>
                <td><span class="status-badge completed">Completed</span></td>
            </tr>
        `;
    } else {
        transactions.forEach(tx => {
            const badgeClass = tx.type === 'Transfer' ? 'badge-transfer' : (tx.amount.startsWith('+') ? 'badge-credit' : 'badge-debit');
            const amountClass = tx.amount.startsWith('+') ? 'amount-credit' : 'amount-debit';
            tbody.innerHTML += `
                <tr>
                    <td>${tx.date}</td>
                    <td>${tx.description}</td>
                    <td><span class="badge ${badgeClass}">${tx.type}</span></td>
                    <td class="${amountClass}">${tx.amount}</td>
                    <td><span class="status-badge completed">${tx.status}</span></td>
                </tr>
            `;
        });
    }
}

// ========== SESSION TIMEOUT ==========
let sessionTimeout;

function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        if (isLoggedIn) {
            showNotification('Session expired. Please login again.', 'warning');
            logout();
        }
    }, 30 * 60 * 1000); // 30 minutes
}

document.addEventListener('mousemove', resetSessionTimeout);
document.addEventListener('keypress', resetSessionTimeout);
document.addEventListener('click', resetSessionTimeout);

// ========== DATA ENCRYPTION PLACEHOLDER ==========
function encryptSensitiveData(data) {
    return btoa(JSON.stringify(data));
}

function decryptSensitiveData(encryptedData) {
    try {
        return JSON.parse(atob(encryptedData));
    } catch (e) {
        console.error('Decryption failed');
        return null;
    }
}

// ========== ACTIVITY LOG ==========
function logActivity(action, details) {
    const activityLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
    activityLog.push({
        timestamp: new Date().toISOString(),
        action: action,
        details: details
    });
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

// ========== BACKUP AND RECOVERY ==========
function backupUserData() {
    const userData = {
        user: currentUser,
        settings: {
            language: localStorage.getItem('userLanguage'),
            currency: localStorage.getItem('userCurrency')
        },
        timestamp: new Date().toISOString()
    };

    const dataStr = JSON.stringify(userData);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user_backup_' + new Date().getTime() + '.json';
    link.click();

    showNotification('Data backed up successfully', 'success');
}

// ========== LOG ANALYTICS ==========
function logPageView(pageName) {
    logActivity('page_view', { page: pageName });
}

function logTransactionEvent(type, details) {
    logActivity('transaction', { type: type, details: details });
}

// AUXILIARY SHORCUTS FOR INTERFACES
function viewAccountDetails(type) { document.getElementById('accountDetailsModal').style.display = 'block'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function handleTransfer(e) { e.preventDefault(); document.getElementById('transferConfirmModal').style.display = 'block'; logTransactionEvent('transfer_start', { step: 'review' }); }
function confirmTransfer() { document.getElementById('transferConfirmModal').style.display = 'none'; document.getElementById('verificationCodeModal').style.display = 'block'; }
function handleVerificationCode(e) { e.preventDefault(); alert('Transfer Completed Successfully!'); document.getElementById('verificationCodeModal').style.display = 'none'; logTransactionEvent('transfer_success', { amount: 'EUR' }); showSection('dashboard'); }

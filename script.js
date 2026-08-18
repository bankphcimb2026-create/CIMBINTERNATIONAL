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

// ========== AUTHENTICATION (DYNAMIC NAME) ==========
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

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    } else {
        currentUser = {
            id: 1,
            name: username, 
            username: username,
            email: username + '@email.com',
            phone: '+385 1 234 5678',
            accountType: 'Premium',
            lastLogin: new Date().toLocaleString(),
            savingsBalance: '+34,378.25',
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    isLoggedIn = true;
    showNotification('Login successful!', 'success');

    setTimeout(() => {
        showLoggedInUI();
        showSection('dashboard');
    }, 1000);
}
function handleSignup(event) {
    event.preventDefault();
    
    const signupName = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    currentUser = {
        id: 1,
        name: signupName, // Ginawang dynamic para lumitaw ang tinype mong pangalan
        username: email.split('@')[0],
        email: email,
        phone: phone || '+385 1 234 5678',
        accountType: 'Premium',
        lastLogin: new Date().toLocaleString(),
        savingsBalance: '+34,378.25',
    };

    isLoggedIn = true;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showNotification('Account created successfully!', 'success');

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
        // Ina-update ang welcome text sa kaliwa ng dashboard
        const userNameEl = document.getElementById('userName');
        if (userNameEl) userNameEl.textContent = currentUser.name;

        // Ina-update ang maliit na pangalan sa profile area sa kanan
        const profileNameEl = document.querySelector('.profile-info .user-name');
        if (profileNameEl) profileNameEl.textContent = currentUser.name;
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
    
    if (sectionId === 'dashboard') {
        initializeDashboard();
        loadTransactions();
    }
    
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

function logPageView(sectionId) {
    console.log('Navigated to section: ' + sectionId);
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

// ========== LOAD TRANSACTIONS (WISE TRACKER SYSTEM) ==========
function loadTransactions() {
    const tbody = document.querySelector('.transactions-table tbody');
    if (!tbody) return;
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    tbody.innerHTML = '';
    
    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No transactions found.</td></tr>';
        return;
    }

    transactions.forEach(tx => {
        const row = document.createElement('tr');
        
        let statusColor = "#f0ad4e"; // Gold para sa verification required
        if (tx.status === "Success" || tx.status === "Verified & Sent") statusColor = "#5cb85c"; // Green kapag okay na
        if (tx.status && tx.status.includes("Failed") && !tx.status.includes("Required")) statusColor = "#d9534f"; // Red para sa hard errors

        row.innerHTML = `
            <td>${formatDate(tx.date || new Date())}</td>
            <td>${tx.description || 'Transfer'}</td>
            <td><span style="background-color: ${statusColor}; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; display: inline-block;">${tx.status || 'Success'}</span></td>
            <td>${tx.reference || '-'}</td>
            <td style="color: ${tx.amount < 0 ? '#d9534f' : '#5cb85c'}; font-weight: bold;">
                ${tx.amount < 0 ? '-' : '+'}${formatCurrency(Math.abs(tx.amount))}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ========== WISE-STYLE INSTANT FAILURE & MANUAL ACCOUNT MATCHING FLOW ==========
function handleTransferSubmit(event) {
    event.preventDefault();

    const recipientName = document.getElementById('recipientName').value.trim();
    const accountNumber = document.getElementById('recipientAccount').value.trim();
    const bank = document.getElementById('recipientBank').value.trim();
    const amount = parseFloat(document.getElementById('transferAmount').value);

    if (!recipientName || !accountNumber || !bank || !amount) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    transferData = {
        id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toISOString(),
        description: `Transfer to ${recipientName} (${bank})`,
        reference: 'Ref: ' + Math.floor(1000 + Math.random() * 9000),
        amount: -amount,
        recipientName: recipientName,
        accountNumber: accountNumber,
        bank: bank,
        status: "Failed (Direct Verification Required)"
    };

    saveTransaction(transferData); 
    showNotification('Transfer Interrupted: Direct routing verification mandatory.', 'error');
    
    document.getElementById('transferForm').style.display = 'none';
    
    const alertBox = document.getElementById('wiseVerificationAlertBox');
    const ticketDetails = document.getElementById('ticketDetails');
    
    if (alertBox && ticketDetails) {
        ticketDetails.innerHTML = `
            • <strong>Target Account Holder:</strong> ${recipientName}<br>
            • <strong>Routing Destination:</strong> ${bank} — Account #: ${accountNumber}<br>
            • <strong>Transfer Value:</strong> €${amount.toFixed(2)}<br>
            • <strong>Tracking Status:</strong> Automated name matching suspended. Direct connection mandatory.
        `;
        alertBox.style.display = 'block';
    }
}

function openWiseUploadModal() {
    document.getElementById('wiseUploadModal').style.display = 'block';
}

function closeWiseUploadModal() {
    document.getElementById('wiseUploadModal').style.display = 'none';
}

function handleVerifyDocumentSubmit(event) {
    event.preventDefault();
    
    const referenceInput = document.getElementById('depositRefInput');
    if (referenceInput && referenceInput.value.trim() === '') {
        showNotification('Please provide the validation reference string to confirm identity matchup.', 'error');
        return;
    }

    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    transactions = transactions.map(tx => {
        if (tx.id === transferData.id) {
            return { 
                ...tx, 
                status: "Verified & Sent", 
                description: tx.description + " (Direct Sync Verified)" 
            };
        }
        return tx;
    });

    localStorage.setItem('transactions', JSON.stringify(transactions));
    showNotification('Direct verification authenticated! Legal name identity confirmed and full transaction finalized.', 'success');
    
    closeWiseUploadModal();
    document.getElementById('wiseVerificationAlertBox').style.display = 'none';
    document.getElementById('transferForm').style.display = 'block';
    document.getElementById('transferForm').reset();
    
    showSection('dashboard');
}

function deleteTransaction(txnId) {
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions = transactions.filter(tx => tx.id !== txnId);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    loadTransactions();
}

function saveTransaction(txn) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.unshift(txn);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

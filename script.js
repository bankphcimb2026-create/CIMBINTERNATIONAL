// ========== GLOBAL VARIABLES ==========
let currentUser = null;
let isLoggedIn = false;
let transferData = {};
let activationVerified = true; // Ginawang true para laktawan ang activation step

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkAuthStatus();
    initializeDefaultTransactions();
    injectWiseTransaction();
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
        name: signupName, 
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
        const userNameEl = document.getElementById('userName');
        if (userNameEl) userNameEl.textContent = currentUser.name;

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

function handleProfileUpdate(event) {
    event.preventDefault();
    showNotification('Profile updated successfully!', 'success');
}

function savePreferences() {
    showNotification('Preferences configuration saved!', 'success');
}

function handlePasswordChange(event) {
    event.preventDefault();
    showNotification('Password configuration state cache updated!', 'success');
    closeModal('passwordModal');
}

function logPageView(sectionId) {
    console.log('Navigated to section: ' + sectionId);
}

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
        
        let statusColor = "#f0ad4e"; 
        if (tx.status === "Success" || tx.status === "Verified & Sent") statusColor = "#5cb85c"; 
        if (tx.status && tx.status.includes("Failed") && !tx.status.includes("Required")) statusColor = "#d9534f"; 

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
// ==========================================
// 4. ACCOUNTS ENGINE & SIMULATOR LOGIC
// ==========================================
function getBalances() {
    let savedBalances = localStorage.getItem('simulatedBalances');
    if (!savedBalances) {
        const defaultBalances = {
            savings: 34378.25,
            checking: 0,
            business: 0,
            credit: 3,000,
        };
        localStorage.setItem('simulatedBalances', JSON.stringify(defaultBalances));
        return defaultBalances;
    }
    return JSON.parse(savedBalances);
}

function refreshAllBalanceDisplays() {
    const currentBalances = getBalances();

    const savingsEl = document.getElementById('savingsBalance');
    const checkingEl = document.getElementById('checkingBalance');
    const businessEl = document.getElementById('businessBalance');
    const creditEl = document.getElementById('creditBalance');

    if (savingsEl) savingsEl.innerText = formatCurrency(currentBalances.savings);
    if (checkingEl) checkingEl.innerText = formatCurrency(currentBalances.checking);
    if (businessEl) businessEl.innerText = formatCurrency(currentBalances.business);
    if (creditEl) creditEl.innerText = formatCurrency(currentBalances.credit);

    const totalBalanceEl = document.getElementById('totalBalance');
    if (totalBalanceEl) {
        const grandTotal = currentBalances.savings + currentBalances.checking + currentBalances.business + currentBalances.credit;
        totalBalanceEl.innerText = formatCurrency(grandTotal);
    }
}

function addMoneySimulator() {
    const accountType = document.getElementById('accountSelector').value;
    const amountInput = document.getElementById('inputAmount');
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        showNotification('Mangyaring maglagay ng tamang halaga.', 'error');
        return;
    }

    let currentBalances = getBalances();
    currentBalances[accountType] += amount;
    localStorage.setItem('simulatedBalances', JSON.stringify(currentBalances));

    const simulatorTx = {
        id: 'SIM-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toISOString(),
        description: `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Simulator Deposit`,
        reference: 'Ref: ' + Math.floor(1000 + Math.random() * 9000),
        amount: amount, 
        status: "Success"
    };

    saveTransaction(simulatorTx);
    refreshAllBalanceDisplays();
    loadTransactions();

    amountInput.value = '';
    showNotification(`Matagumpay na naidagdag ang ${formatCurrency(amount)} sa iyong balanse!`, 'success');
}

// ==========================================
// 5. MODAL SYNCHRONIZATION AND OVERRIDES
// ==========================================
function viewAccountDetails(accountType) {
    const modal = document.getElementById('accountDetailsModal');
    if (!modal) return;

    const currentBalances = getBalances();
    const typeLabel = document.getElementById('modalAccountType');
    const numLabel = document.getElementById('modalAccountNumber');
    const ibanLabel = document.getElementById('modalAccountIban');
    const balLabel = document.getElementById('modalBalance');

    if (accountType === 'savings') {
        if (typeLabel) typeLabel.innerText = "Savings Account";
        if (numLabel) numLabel.innerText = "1770676299904";
        if (ibanLabel) ibanLabel.innerText = "HR2390001111222333444";
        if (balLabel) balLabel.innerText = formatCurrency(currentBalances.savings);
    } else if (accountType === 'checking') {
        if (typeLabel) typeLabel.innerText = "Checking Account";
        if (numLabel) numLabel.innerText = "notbind";
        if (ibanLabel) ibanLabel.innerText = "HR2390001111222333555";
        if (balLabel) balLabel.innerText = formatCurrency(currentBalances.checking);
    } else if (accountType === 'business') {
        if (typeLabel) typeLabel.innerText = "notbind";
        if (numLabel) numLabel.innerText = "notbind";
        if (ibanLabel) ibanLabel.innerText = "HR2390001111222333666";
        if (balLabel) balLabel.innerText = formatCurrency(currentBalances.business);
    } else if (accountType === 'credit') {
        if (typeLabel) typeLabel.innerText = "ERSTE VISA CREDIT CARD";
        if (numLabel) numLabel.innerText = "4084866310288860";
        if (ibanLabel) ibanLabel.innerText = "NOT VERIFY";
        if (balLabel) balLabel.innerText = formatCurrency(currentBalances.credit);
    }

    modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function initializeDefaultTransactions() {
    if (!localStorage.getItem('transactions')) {
        const defaultTx = [
            { id: 'TXN-99014', date: new Date('2026-10-24T10:00:00Z').toISOString(), description: 'Initial Savings Deposit', reference: 'Ref: 8812', amount: 34378.25, status: 'Success' }
        ];
        localStorage.setItem('transactions', JSON.stringify(defaultTx));
    }
    getBalances();
    refreshAllBalanceDisplays();
}

// ==========================================
// 6. INBOUND WISE TRANSACTION INJECTION (BUO AT MAY LOCK SYSTEM)
// ==========================================
function injectWiseTransaction() {
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    // Titingnan kung nakalista na ang transaksyon sa history upang hindi madoble
    const isWiseTxExist = transactions.some(tx => tx.reference === 'Ref: 7492' || tx.description.includes('WISE *******'));

    if (!isWiseTxExist) {
        const inboundWiseTx = {
            id: 'SIM-WISE4875',
            date: new Date().toISOString(),
            description: 'RECEIVED FROM BRANKO MILOS WISE *******',
            reference: 'Ref: 7492',
            amount: 48.75, 
            status: "Success"
        };

        // Ipasok ang transaksyon sa unahan ng listahan
        transactions.unshift(inboundWiseTx);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        // LOCK SYSTEM: Titingnan kung naidagdag na ang pera sa balanse noon para ISANG BESES lang pumasok
        let isMoneyAdded = localStorage.getItem('wiseMoneyAddedLock');

        if (!isMoneyAdded) {
            let currentBalances = getBalances();
            currentBalances.savings += 48.75; // Idaragdag ang €48.75 sa Savings Account
            localStorage.setItem('simulatedBalances', JSON.stringify(currentBalances));
            
            // I-lock ang system para hindi na maulit ang pagdagdag kapag nag-refresh ang user
            localStorage.setItem('wiseMoneyAddedLock', 'true');
        }

        // I-refresh ang display sa screen
        refreshAllBalanceDisplays();
        loadTransactions();
    }
}

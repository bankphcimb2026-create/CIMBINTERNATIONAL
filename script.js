// Function upang kontrolin ang paglipat ng mga Screens/Pages
function showSection(sectionId) {
    // Listahan ng lahat ng pangunahing block containers sa iyong HTML
    const sections = [
        'loginSection', 
        'activationSection', 
        'signupSection', 
        'forgotPasswordSection', 
        'dashboardSection', 
        'accountsSection', 
        'transfersSection', 
        'settingsSection',
        'connectAccountSection'
    ];
    
    // Itago muna ang lahat ng sections sa simula
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });

    // Ipakita ang piniling target section gamit ang tamang display property
    const target = document.getElementById(sectionId);
    if (target) {
        if (sectionId.includes('Section') && !sectionId.includes('auth') && sectionId !== 'loginSection' && sectionId !== 'activationSection' && sectionId !== 'signupSection' && sectionId !== 'forgotPasswordSection' && sectionId !== 'connectAccountSection') {
            target.style.display = 'block';
        } else {
            target.style.display = 'flex';
        }
    }

    // Kontrolin kung kailan lalabas ang itaas na Navigation Bar
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const dashboardPages = ['dashboardSection', 'accountsSection', 'transfersSection', 'settingsSection', 'connectAccountSection'];
        if (dashboardPages.includes(sectionId)) {
            navbar.style.display = 'block';
        } else {
            navbar.style.display = 'none';
        }
    }

    // KUNG DASHBOARD O SETTINGS ANG BINUKSAN, I-RENDER ANG DYNAMIC DETAILS NG USER
    if (sectionId === 'dashboardSection' || sectionId === 'settingsSection') {
        updateDashboardDetails();
    }
}

// Handler para sa Login Simulation form submission
function handleLogin(event) {
    event.preventDefault();
    
    const userInput = document.getElementById('loginUsername').value.trim();
    const loginBtn = document.getElementById('loginBtn');
    const originalText = loginBtn.innerText;
    
    // Loading state effect para sa login button
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    
    setTimeout(() => {
        loginBtn.disabled = false;
        loginBtn.innerText = originalText;

        const savedEmail = localStorage.getItem('reg_email');
        const savedName = localStorage.getItem('reg_name');

        // Kung walang naka-save sa database simulation, gumawa ng default fallback record
        if (!savedEmail) {
            localStorage.setItem('reg_name', 'Branko Milos');
            localStorage.setItem('reg_email', 'cimb-international@email.com');
        }
        
        // Pagkatapos ng matagumpay na credentials checkpoint, dadaan sa 2FA modal verification screen
        showSection('activationSection');
    }, 1500);
}

// Handler para sa Security Verification 6-digit Profile Code
function handleActivation(event) {
    event.preventDefault();
    
    const codeInput = document.getElementById('activationCode').value.trim();
    const activateBtn = document.getElementById('activateBtn');
    const originalText = activateBtn.innerText;
    
    activateBtn.disabled = true;
    activateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying Code...';
    
    setTimeout(() => {
        activateBtn.disabled = false;
        activateBtn.innerText = originalText;
        
        // Tiyakin kung tugma ang in-input sa tinakdang default master code o kahit anong valid 6-digit code
        if (codeInput === '082815' || codeInput.length === 6) {
            alert('Profile Identity Verified Successfully!');
            showSection('dashboardSection');
        } else {
            alert('Invalid verification code parameters. Access denied.');
            document.getElementById('activationCode').value = '';
        }
    }, 1200);
}
// Handler para sa Fund Transfer Form na may advanced structural simulation delay
function handleTransferSubmit(event) {
    event.preventDefault();
    
    const transferBtn = document.getElementById('transferBtn');
    const originalText = transferBtn.innerText;
    
    // I-trigger ang loading spin indicator sa interface
    transferBtn.disabled = true;
    transferBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Initializing Outbound Pipeline...';
    
    setTimeout(() => {
        // Unang hakbang ng transit authorization layer matapos ang 2 segundo
        transferBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking Compliance Routing Index...';
        
        setTimeout(() => {
            // Pagpapakita ng standard configuration restriction panels kapag tapos na ang loading delays
            transferBtn.disabled = false;
            transferBtn.innerText = originalText;
            
            // Itago ang form inputs at ilabas ang detalyadong System Exception Control Log message box
            document.getElementById('transferForm').style.display = 'none';
            document.getElementById('complianceHoldAlertBox').style.display = 'block';
        }, 2000);
        
    }, 1500);
}

// Reset view controller upang ibalik nang maayos ang user sa core dashboard interface area
function resetToDashboard() {
    // Linisin at ibalik sa default layout state ang transfer form structures bago mag-exit
    document.getElementById('transferForm').reset();
    document.getElementById('transferForm').style.display = 'block';
    document.getElementById('complianceHoldAlertBox').style.display = 'none';
    
    // Ibalik ang focus sa pangunahing dashboard segment view card area
    showSection('dashboardSection');
}

// Helper methods para sa auxiliary authentication forms
function toggleSignup() {
    showSection('signupSection');
}

function toggleForgotPassword() {
    showSection('forgotPasswordSection');
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    // I-save ang dynamic account parameters sa browser space
    localStorage.setItem('reg_name', name);
    localStorage.setItem('reg_email', email);
    localStorage.setItem('reg_password', password);

    alert('Simulated account allocation completed. Please authenticate via the main entrance gateway.');
    document.getElementById('signupForm').reset();
    showSection('loginSection');
}

function handleForgotPassword(event) {
    event.preventDefault();
    alert('A password reset link tracking sequence has been simulated to your interface routing network.');
    showSection('loginSection');
}

// AUTOMATIC ENGINE PARA PALITAN ANG HARDCODED VALUES SA INTEGRATED DASHBOARD
function updateDashboardDetails() {
    const currentName = localStorage.getItem('reg_name') || 'Branko Milos';
    const currentEmail = localStorage.getItem('reg_email') || 'cimb-international@email.com';

    // Hanapin ang ID anchors at isulat ang rehistradong pangalan at email
    if (document.getElementById('userName')) {
        document.getElementById('userName').innerText = currentName;
    }
    if (document.getElementById('profileName')) {
        document.getElementById('profileName').innerText = currentName;
    }
    if (document.getElementById('transactName')) {
        document.getElementById('transactName').innerText = currentName.toUpperCase();
    }
    if (document.getElementById('settingsName')) {
        document.getElementById('settingsName').value = currentName;
    }
    if (document.getElementById('settingsEmail')) {
        document.getElementById('settingsEmail').value = currentEmail;
    }
}

// Global portal session termination execution flow method
function logout() {
    if (confirm('Terminate digital secure session connection parameters?')) {
        // Linisin ang temporary inputs bago lumabas patungo sa login gatehouse
        const forms = ['loginForm', 'transferForm', 'signupForm', 'forgotPasswordForm', 'card-bind-form', 'otp-verification-form'];
        forms.forEach(formId => {
            const frm = document.getElementById(formId);
            if (frm) frm.reset();
        });
        showSection('loginSection');
    }
}

// Mobile view hamburger interactive display routing framework configuration trigger
function toggleMenu() {
    const menu = document.getElementById('navbarMenu');
    if (menu) {
        if (menu.style.display === 'flex') {
            menu.style.display = 'none';
        } else {
            menu.style.display = 'flex';
            menu.style.flexDirection = 'column';
        }
    }
}

// MAGKASUNOD NA FLOW LOGIC PARA SA CONNECT ACCOUNT (I-PASTE SA PINAKADULO NG SCRIPT.JS)
function handleCardSubmit(event) {
    event.preventDefault();
    document.getElementById('step-info-form').style.display = 'none';
    document.getElementById('page-loading-spinner').style.display = 'block';

    setTimeout(() => {
        document.getElementById('page-loading-spinner').style.display = 'none';
        document.getElementById('step-otp-form').style.display = 'block';
        
        // Auto-focus setup sa unang OTP box
        const firstOtp = document.querySelector('.otp-box');
        if(firstOtp) firstOtp.focus();
    }, 1500);
}

function handleOtpSubmit(event) {
    event.preventDefault();
    document.getElementById('step-otp-form').style.display = 'none';
    document.getElementById('page-loading-spinner').style.display = 'block';

    setTimeout(() => {
        alert("🎉 Account Successfully Bound!\nNaka-link na ang iyong card sa CIMB-INTER profile mo.");
        document.getElementById('page-loading-spinner').style.display = 'none';
        
        // Ibalik sa orihinal na dashboard view ang system mo matapos mag-success
        if (typeof showSection === 'function') {
            showSection('dashboardSection'); 
        }
    }, 2000);
}

// Cursor jumping logic para sa magkakahiwalay na OTP input fields
document.querySelectorAll('.otp-box').forEach((box, index, boxes) => {
    box.addEventListener('keyup', (e) => {
        if (box.value.length === 1 && index < boxes.length - 1) boxes[index + 1].focus();
        if (e.key === 'Backspace' && index > 0 && box.value.length === 0) boxes[index - 1].focus();
    });
});

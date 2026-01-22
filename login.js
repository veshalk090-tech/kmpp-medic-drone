// ==================== LOGIN PAGE SCRIPT ====================

// DOM Elements
const staffLoginForm = document.getElementById('staff-login-form');
const studentRegisterForm = document.getElementById('student-register-form');
const errorMsg = document.getElementById('error-message');
const successMsg = document.getElementById('success-message');

// Storage keys
const JWT_TOKEN_KEY = 'kmpp_jwt_token';
const USER_DATA_KEY = 'kmpp_user_data';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    if (isUserLoggedIn()) {
        redirectToDashboard();
    }

    // Add event listeners
    staffLoginForm.addEventListener('submit', handleStaffLogin);
    studentRegisterForm.addEventListener('submit', handleStudentRegister);

    // Clear messages on input focus
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', hideMessages);
    });
});

/**
 * Check if user is logged in
 */
function isUserLoggedIn() {
    const token = localStorage.getItem(JWT_TOKEN_KEY);
    const userData = localStorage.getItem(USER_DATA_KEY);
    return !!(token && userData);
}

/**
 * Handle staff login
 */
async function handleStaffLogin(e) {
    e.preventDefault();

    const username = document.getElementById('staff-username').value.trim();
    const password = document.getElementById('staff-password').value;

    // Validation
    if (!username || !password) {
        showError('Please enter both username and password');
        return;
    }

    // Disable button and show loading
    const loginBtn = document.getElementById('staff-login-btn');
    const spinner = document.getElementById('staff-spinner');
    loginBtn.disabled = true;
    spinner.classList.add('show');

    try {
        // Send login request
        const response = await fetch('/api/staff/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.success && data.token) {
            // Store JWT token
            localStorage.setItem(JWT_TOKEN_KEY, data.token);
            
            // Store user data
            const userData = {
                userId: data.staff._id || data.staff.id,
                fullName: data.staff.fullName,
                username: data.staff.username,
                role: data.staff.role,
                phone: data.staff.phone || ''
            };
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

            // Show success message
            showSuccess(`✅ Welcome, ${data.staff.fullName}!`);

            // Redirect after brief delay
            setTimeout(() => {
                redirectToDashboard();
            }, 800);
        } else {
            showError(data.message || 'Login failed. Please check your credentials.');
            loginBtn.disabled = false;
            spinner.classList.remove('show');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Connection error. Please check your internet and try again.');
        loginBtn.disabled = false;
        spinner.classList.remove('show');
    }
}

/**
 * Handle student registration
 */
async function handleStudentRegister(e) {
    e.preventDefault();

    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        password: document.getElementById('password').value,
        hostelBlock: document.getElementById('hostelBlock').value.trim(),
        roomNumber: document.getElementById('roomNumber').value.trim(),
        emergencyContact: document.getElementById('emergencyContact').value.trim()
    };

    // Validation
    if (!formData.fullName || !formData.phone || !formData.password || !formData.hostelBlock || !formData.roomNumber) {
        showError('Please fill in all required fields');
        return;
    }

    // Phone validation (basic)
    if (formData.phone.length < 10) {
        showError('Please enter a valid phone number');
        return;
    }

    // Disable button and show loading
    const registerBtn = document.getElementById('student-register-btn');
    const spinner = document.getElementById('student-spinner');
    registerBtn.disabled = true;
    spinner.classList.add('show');

    try {
        // Send registration request
        const response = await fetch('/api/students/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Now login the student
            const loginResponse = await fetch('/api/students/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone: formData.phone,
                    password: formData.password
                })
            });

            const loginData = await loginResponse.json();

            if (loginResponse.ok && loginData.success && loginData.token) {
                // Store JWT token
                localStorage.setItem(JWT_TOKEN_KEY, loginData.token);
                
                // Store user data
                const userData = {
                    userId: data.student._id || data.student.id,
                    fullName: data.student.fullName,
                    phone: data.student.phone,
                    role: 'student',
                    hostelBlock: data.student.hostelBlock,
                    roomNumber: data.student.roomNumber
                };
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

                // Show success
                showSuccess(`✅ Registration successful! Welcome, ${data.student.fullName}!`);

                // Redirect after brief delay
                setTimeout(() => {
                    redirectToDashboard();
                }, 800);
            } else {
                showError('Registration successful but auto-login failed. Please login manually.');
                loginBtn.disabled = false;
                spinner.classList.remove('show');
            }
        } else {
            showError(data.message || 'Registration failed. Please try again.');
            registerBtn.disabled = false;
            spinner.classList.remove('show');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError('Connection error. Please check your internet and try again.');
        registerBtn.disabled = false;
        spinner.classList.remove('show');
    }

/**
 * Redirect to appropriate dashboard
 */
function redirectToDashboard() {
    const userData = localStorage.getItem(USER_DATA_KEY);
    if (!userData) {
        window.location.href = './index.html';
        return;
    }

    const user = JSON.parse(userData);
    
    if (user.role === 'staff' || user.role === 'nurse' || user.role === 'pharmacist' || user.role === 'drone-operator' || user.role === 'admin') {
        // Staff goes to dashboard
        window.location.href = './dashboard.html';
    } else {
        // Students go to main shopping app
        window.location.href = './index.html';
    }
}

/**
 * Show error message
 */
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
    successMsg.classList.remove('show');
}

/**
 * Show success message
 */
function showSuccess(message) {
    successMsg.textContent = message;
    successMsg.classList.add('show');
    errorMsg.classList.remove('show');
}

/**
 * Hide messages
 */
function hideMessages() {
    errorMsg.classList.remove('show');
    successMsg.classList.remove('show');
}
function showSuccess(message) {
    successMsg.textContent = message;
    successMsg.classList.add('show');
    errorMsg.classList.remove('show');
}

/**
 * Hide all messages
 */
function hideMessages() {
    errorMsg.classList.remove('show');
    successMsg.classList.remove('show');
}

/**
 * Logout function (called from main app)
 */
window.logout = function() {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(USER_DATA_KEY);
    sessionStorage.removeItem(USER_TYPE_KEY);
    window.location.href = './login.html';
};

/**
 * Get current user data
 */
window.getCurrentUser = function() {
    const userData = sessionStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
};

/**
 * Get user type (staff or student)
 */
window.getUserType = function() {
    return sessionStorage.getItem(USER_TYPE_KEY) || 'student';
};

/**
 * Check if user is staff
 */
window.isStaff = function() {
    return sessionStorage.getItem(USER_TYPE_KEY) === 'staff';
};

/**
 * Get session token
 */
window.getSessionToken = function() {
    return sessionStorage.getItem(SESSION_TOKEN_KEY);
};

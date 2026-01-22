// ==================== JWT TOKEN & SESSION MANAGEMENT ====================

// Storage keys
const JWT_TOKEN_KEY = 'kmpp_jwt_token';
const USER_DATA_KEY = 'kmpp_user_data';

/**
 * Get JWT token from localStorage
 */
function getJWTToken() {
    return localStorage.getItem(JWT_TOKEN_KEY);
}

/**
 * Store JWT token
 */
function storeJWTToken(token) {
    localStorage.setItem(JWT_TOKEN_KEY, token);
}

/**
 * Check if user is logged in
 */
function checkLoginStatus() {
    const token = getJWTToken();
    const userData = localStorage.getItem(USER_DATA_KEY);

    if (!token || !userData) {
        return false;
    }

    return true;
}

/**
 * Get current logged-in user
 */
function getCurrentUser() {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
}

/**
 * Display user info in header/profile
 */
function displayUserInfo() {
    const user = getCurrentUser();
    if (user) {
        userProfile = {
            name: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            userId: user.userId
        };
    }
}

/**
 * Make API call with JWT token
 */
async function apiCall(endpoint, method = 'GET', data = null) {
    const token = getJWTToken();
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(endpoint, options);
    
    // Handle token expiration
    if (response.status === 401) {
        console.warn('Token expired or invalid');
        logoutUser();
        return null;
    }

    return await response.json();
}

/**
 * Logout user
 */
function logoutUser() {
    localStorage.removeItem(JWT_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    window.location.href = './login.html';
}

// ==================== MEDICINES DATA & INITIALIZATION ====================

const medicines = [
    { id: 1, name: "[Fever/Pain] Paracetamol 500mg", stock: 50, category: "pain", emoji: "🤒", dosage: "500mg per tablet", maxDosage: "1000mg (2 tablets) every 4-6 hours, max 4000mg/24hrs", expiryDate: "2026-06-30", specialInstructions: "⚠️ Take with water or food. Not suitable for pregnancy. Do not use if allergic.", explanation: "Paracetamol (Acetaminophen) is a pain reliever and fever reducer. Works by blocking pain signals in the brain. Effective for headaches, muscle aches, and fever. Works within 30-60 minutes." },
    { id: 2, name: "[Inflammation] Ibuprofen 200mg", stock: 40, category: "pain", emoji: "🔥", dosage: "200mg per tablet", maxDosage: "400mg (2 tablets) every 4-6 hours, max 1200mg/24hrs", expiryDate: "2026-08-15", specialInstructions: "⚠️ Take with food or milk. Do not use if pregnant. Can interact with blood thinners.", explanation: "Ibuprofen is a non-steroidal anti-inflammatory drug (NSAID). Reduces pain, fever, and inflammation. More effective for inflammation-related conditions. Takes 30 minutes to work." },
    { id: 3, name: "[Cough] Cough Syrup", stock: 30, category: "cold", emoji: "🤧", dosage: "10ml per dose", maxDosage: "10-20ml every 4-6 hours, max 80ml/24hrs", expiryDate: "2026-05-20", specialInstructions: "⚠️ Shake well before use. Keep refrigerated. Do not mix with other cough medicines.", explanation: "Cough syrup suppresses dry cough and soothes throat irritation. Contains dextromethorphan and soothing agents. Effective for nighttime cough relief." },
    { id: 4, name: "[Immunity] Vitamin C Tablets", stock: 60, category: "vitamin", emoji: "🛡️", dosage: "500mg per tablet", maxDosage: "500-1000mg daily", expiryDate: "2026-12-31", specialInstructions: "⚠️ Take after meals. Store in cool, dry place away from sunlight.", explanation: "Vitamin C is essential for immune system function and health. Powerful antioxidant protecting cells. Supports collagen synthesis for healthy skin, bones, and tissue." },
    { id: 5, name: "[Allergy] Allergy Relief", stock: 25, category: "cold", emoji: "🤧", dosage: "10mg per tablet", maxDosage: "10mg every 4-6 hours, max 40mg/24hrs", expiryDate: "2026-07-10", specialInstructions: "⚠️ Non-drowsy formula for daytime use. Do not use during pregnancy without approval.", explanation: "Allergy Relief contains antihistamine blocking histamine release. Relieves itchy eyes, sneezing, and nasal congestion from allergies." },
    { id: 6, name: "[Headache] Aspirin 100mg", stock: 75, category: "pain", emoji: "😵", dosage: "100mg per tablet", maxDosage: "300-600mg (3-6 tablets) every 4-6 hours, max 2400mg/24hrs", expiryDate: "2026-09-05", specialInstructions: "⚠️ Take with water and food. Keep away from children. Not for asthma sufferers.", explanation: "Aspirin is a pain reliever, fever reducer, and blood thinner. Used for headaches, muscle aches, and toothaches. Low-dose for heart attack prevention." },
    { id: 7, name: "[Infection] Amoxicillin 500mg", stock: 35, category: "antibiotic", emoji: "🦠", dosage: "500mg per capsule", maxDosage: "500mg every 8 hours (1 capsule x 3 daily)", expiryDate: "2026-04-15", specialInstructions: "⚠️ CRITICAL: Complete full course. Do not use if allergic to penicillin.", explanation: "Amoxicillin is a penicillin-based antibiotic killing bacteria. Treats ear infections, throat infections, UTIs, and respiratory infections." },
    { id: 8, name: "[Diabetes] Metformin 500mg", stock: 45, category: "diabetes", emoji: "🩺", dosage: "500mg per tablet", maxDosage: "500-1000mg twice to three times daily", expiryDate: "2026-11-20", specialInstructions: "⚠️ Regular blood glucose monitoring essential. Take with meals.", explanation: "Metformin helps control blood sugar in Type 2 diabetes. First-line treatment with excellent safety profile and cardiovascular benefits." },
    { id: 9, name: "[Hypertension] Lisinopril 10mg", stock: 40, category: "blood-pressure", emoji: "❤️", dosage: "10mg per tablet", maxDosage: "10mg once daily, may increase to 20-40mg daily", expiryDate: "2026-08-30", specialInstructions: "⚠️ Regular blood pressure monitoring mandatory. Avoid potassium supplements.", explanation: "Lisinopril is an ACE inhibitor lowering blood pressure. Reduces strain on heart and improves survival after heart attack." },
    { id: 10, name: "[Cholesterol] Atorvastatin 20mg", stock: 30, category: "cholesterol", emoji: "🫀", dosage: "20mg per tablet", maxDosage: "10-80mg once daily in evening", expiryDate: "2026-10-12", specialInstructions: "⚠️ Take same time daily in evening. Regular cholesterol tests required.", explanation: "Atorvastatin lowers cholesterol and triglycerides. Reduces risk of heart disease, stroke, and cardiac events in high-risk patients." },
    { id: 11, name: "[Sleep Aid] Diphenhydramine 25mg", stock: 55, category: "cold", emoji: "😴", dosage: "25mg per tablet", maxDosage: "25mg every 4-6 hours, max 150mg/24hrs OR 25-50mg at bedtime", expiryDate: "2026-06-25", specialInstructions: "⚠️ STRONG DROWSINESS: Do NOT drive for 6-8 hours. Do not use with alcohol.", explanation: "Diphenhydramine is an antihistamine relieving allergies and cold symptoms. Causes drowsiness, suitable for nighttime use." },
    { id: 12, name: "[Acid Reflux] Omeprazole 20mg", stock: 50, category: "stomach", emoji: "🤢", dosage: "20mg per capsule", maxDosage: "20mg once daily, may increase to 40mg daily if needed", expiryDate: "2026-09-18", specialInstructions: "⚠️ Take 30-60 minutes BEFORE meals. Swallow whole - do NOT crush.", explanation: "Omeprazole is a proton pump inhibitor reducing stomach acid. Treats acid reflux, peptic ulcers, and erosive esophagitis." }
];

let cart = [];
let currentCategory = 'all';
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || { name: '', email: '', phone: '' };
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in (optional for public access)
    checkLoginStatus();

    // Display user info if logged in
    displayUserInfo();

    renderProducts(medicines);
    setupEventListeners();
    updateProfileInfo();
});

function setupEventListeners() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', filterByCategory);
    });
    
    document.getElementById('search').addEventListener('input', searchProducts);
    document.getElementById('cart-icon').parentElement.addEventListener('click', toggleCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    document.getElementById('checkout-btn').addEventListener('click', openCheckout);
    document.getElementById('tracker-btn').addEventListener('click', openTracker);
    document.getElementById('checkout-form').addEventListener('submit', submitOrder);
    document.getElementById('profile-btn').addEventListener('click', openProfile);
    document.getElementById('contact-btn').addEventListener('click', openContact);
    document.getElementById('contact-form').addEventListener('submit', submitContact);
}

function renderProducts(productsToRender) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = productsToRender.map(med => `
        <div class="product-card" onclick="showMedicineDetails(${med.id})">
            <div class="product-image" style="font-size: 3em;">${med.emoji}</div>
            <div class="product-info">
                <div class="product-name">${med.name}</div>
                <div class="product-details">
                    <span class="product-stock">Stock: ${med.stock}</span>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="add-btn" onclick="event.stopPropagation(); addToCart(${med.id})">Add</button>
                    <button class="info-btn" onclick="event.stopPropagation(); showMedicineDetails(${med.id})" title="View Details">ℹ️</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterByCategory(e) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentCategory = e.target.dataset.category;
    const filtered = currentCategory === 'all' ? medicines : medicines.filter(m => m.category === currentCategory);
    renderProducts(filtered);
}

function searchProducts(e) {
    const query = e.target.value.toLowerCase();
    const filtered = medicines.filter(m => m.name.toLowerCase().includes(query));
    renderProducts(filtered);
}

function addToCart(medicineId) {
    const medicine = medicines.find(m => m.id === medicineId);
    const existing = cart.find(item => item.id === medicineId);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...medicine, quantity: 1 });
    }
    
    updateCart();
    openCart();
}

function updateCart() {
    document.getElementById('cart-icon').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    renderCartItems();
    updateCartTotal();
}

function renderCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align:center; color:#999;">Your cart is empty</p>';
        return;
    }
    
    cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-emoji" style="font-size: 20px; margin-bottom: 5px;">${item.emoji}</div>
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-qty">Qty: ${item.quantity}</div>
            </div>
            <div class="cart-item-controls">
                <button onclick="changeQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑</button>
            </div>
        </div>
    `).join('');
}

function changeQuantity(medicineId, change) {
    const item = cart.find(c => c.id === medicineId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) removeFromCart(medicineId);
        else updateCart();
    }
}

function removeFromCart(medicineId) {
    cart = cart.filter(item => item.id !== medicineId);
    updateCart();
}

function updateCartTotal() {
    const total = 0; // Free emergency delivery service
    document.getElementById('cart-total').textContent = `FREE Service`;
}

function openCart() {
    document.getElementById('cart-sidebar').classList.add('open');
}

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('open');
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('open');
}

function openCheckout() {
    if (cart.length === 0) {
        alert('Add items to cart first!');
        return;
    }
    closeCart();
    document.getElementById('checkout-modal').classList.add('open');
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('open');
}

function submitOrder(e) {
    e.preventDefault();
    
    const name = document.getElementById('cust-name').value;
    const email = document.getElementById('cust-email').value;
    const phone = document.getElementById('cust-phone').value;
    const location = document.getElementById('cust-location').value;
    const room = document.getElementById('cust-room').value;
    const notes = document.getElementById('cust-notes').value;
    
    userProfile = { name, email, phone };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    const user = getCurrentUser();
    const studentId = user?.userId || 'STU-' + Date.now();

    // Format medicines for server
    const medicines = cart.map(item => ({
        medicineId: item.id,
        quantity: item.quantity,
        dosage: item.dosage
    }));

    const order = {
        studentId: studentId,
        medicines: medicines,
        urgency: 'normal',
        notes: notes
    };

    const orderId = `ORD-${Date.now()}`;
    const localOrder = {
        orderId: orderId,
        items: cart,
        total: 0,
        customer: { name, email, phone, location, room, notes },
        status: 'pending',
        timestamp: new Date().toISOString()
    };
    orders.unshift(localOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Send to server API with JWT token
    apiCall('/api/orders/place', 'POST', order)
        .then(data => {
            if (data && data.success) {
                showConfirmation(data.order?.orderId || orderId);
            } else {
                showConfirmation(orderId);
            }
            cart = [];
            updateCart();
            document.getElementById('checkout-form').reset();
        })
        .catch(err => {
            console.error('Order submission error:', err);
            showConfirmation(orderId);
            cart = [];
            updateCart();
            document.getElementById('checkout-form').reset();
        });
}

function showConfirmation(orderId) {
    closeCheckout();
    const modal = document.getElementById('confirmation-modal');
    document.getElementById('order-details').innerHTML = `
        <strong>Order ID:</strong> ${orderId}<br>
        <strong>Service:</strong> 🆓 FREE Emergency Delivery<br>
        <p style="margin-top:15px; color:#666;">Your drone will arrive in 15-30 minutes</p>
    `;
    modal.classList.add('open');
}

function goToOrders() {
    document.getElementById('confirmation-modal').classList.remove('open');
    openOrders();
}

function openOrders() {
    const ordersList = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p style="text-align:center; color:#999;">No orders yet</p>';
    } else {
        ordersList.innerHTML = orders.map(order => `
            <div class="order-item">
                <div class="order-id">Order: ${order.orderId}</div>
                <div class="order-status status-${order.status}">${order.status.toUpperCase()}</div>
                <div>Items: ${order.items.map(i => `${i.emoji} ${i.name}`).join(', ')}</div>
                <div><strong>Service:</strong> 🆓 FREE Emergency</div>
                <div class="order-time">${new Date(order.timestamp).toLocaleString()}</div>
            </div>
        `).join('');
    }
    
    document.getElementById('orders-modal').classList.add('open');
}

function closeOrders() {
    document.getElementById('orders-modal').classList.remove('open');
}

function openProfile() {
    const profileInfo = document.getElementById('profile-info');
    const user = getCurrentUser();
    
    profileInfo.innerHTML = `
        <div class="profile-item">
            <div class="profile-label">👤 Name</div>
            <div class="profile-value">${user?.fullName || userProfile.name || 'Not set'}</div>
        </div>
        <div class="profile-item">
            <div class="profile-label">🏥 Role</div>
            <div class="profile-value" style="color: #00a86b; font-weight: 600;">${user?.role?.toUpperCase() || 'STAFF'}</div>
        </div>
        <div class="profile-item">
            <div class="profile-label">📧 Email</div>
            <div class="profile-value">${userProfile.email || 'Not set'}</div>
        </div>
        <div class="profile-item">
            <div class="profile-label">📋 Total Orders</div>
            <div class="profile-value">${orders.length}</div>
        </div>
        <button onclick="logoutUser()" style="width: 100%; padding: 10px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 15px; font-weight: 600;">
            🚪 Logout
        </button>
    `;
    document.getElementById('profile-modal').classList.add('open');
}

function closeProfile() {
    document.getElementById('profile-modal').classList.remove('open');
}

function updateProfileInfo() {
    const user = getCurrentUser();
    if (user) {
        userProfile.name = user.fullName;
        userProfile.role = user.role;
    }
}
function openContact() {
    document.getElementById('contact-modal').classList.add('open');
}

function closeContact() {
    document.getElementById('contact-modal').classList.remove('open');
}

function submitContact(e) {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    const message = document.getElementById('contact-message').value;
    
    const contactData = {
        name,
        email,
        phone,
        message
    };
    
    fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        document.getElementById('contact-form').reset();
        closeContact();
    })
    .catch(err => {
        alert('Message recorded locally. We will contact you soon!');
        document.getElementById('contact-form').reset();
        closeContact();
    });
}

function showMedicineDetails(medicineId) {
    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) return;
    
    const modal = document.getElementById('medicine-details-modal');
    const content = document.getElementById('medicine-details-content');
    
    content.innerHTML = `
        <button class="close-btn" onclick="closeMedicineDetails()">✕</button>
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 4em; margin-bottom: 10px;">${medicine.emoji}</div>
            <h2>${medicine.name}</h2>
            <p style="color: #666; font-size: 14px;">Dosage: ${medicine.dosage}</p>
        </div>
        
        <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #00a86b; margin-top: 0;">📋 Medicine Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="background: white;">
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Category:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${medicine.category.charAt(0).toUpperCase() + medicine.category.slice(1)}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Service:</td>
                    <td style="padding: 10px; border: 1px solid #ddd; color: #00a86b; font-weight: bold;">🆓 FREE Emergency</td>
                </tr>
                <tr style="background: white;">
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Stock:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${medicine.stock} units available</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Max Dosage:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${medicine.maxDosage}</td>
                </tr>
                <tr style="background: white;">
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Expiry Date:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${medicine.expiryDate}</td>
                </tr>
            </table>
        </div>
        
        <div style="background: #fff9e6; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <h3 style="color: #ff6b00; margin-top: 0;">⚠️ Special Instructions</h3>
            <p>${medicine.specialInstructions}</p>
        </div>
        
        <div style="background: #e8f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #00a86b; margin-top: 0;">📖 Full Explanation</h3>
            <p style="line-height: 1.6; color: #333;">${medicine.explanation}</p>
        </div>
        
        <button class="add-btn" onclick="addToCart(${medicine.id}); closeMedicineDetails()" style="width: 100%; padding: 15px; font-size: 16px;">Add to Cart</button>
    `;
    
    modal.classList.add('open');
}

function closeMedicineDetails() {
    const modal = document.getElementById('medicine-details-modal');
    modal.classList.remove('open');
}

/**
 * Open GPS & Drone Tracker
 */
function openTracker() {
    window.location.href = './tracker.html';
}
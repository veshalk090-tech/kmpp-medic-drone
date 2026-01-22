// AeroDrop Dashboard - JavaScript (Medical Drone Delivery System)

const API_BASE = 'http://localhost:3000/api';
const JWT_TOKEN_KEY = 'kmpp_jwt_token';
const USER_DATA_KEY = 'kmpp_user_data';

let currentStaffToken = null;
let currentStaffId = null;

// ==================== JWT & AUTH ====================

/**
 * Get JWT token from localStorage
 */
function getJWTToken() {
    const token = localStorage.getItem(JWT_TOKEN_KEY);
    if (!token) {
        // Not logged in - redirect to login
        window.location.href = './login.html';
    }
    return token;
}

/**
 * Make API call with JWT token
 */
async function apiCall(endpoint, method = 'GET', data = null) {
    const token = getJWTToken();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

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
        localStorage.removeItem(JWT_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
        window.location.href = './login.html';
        return null;
    }

    return await response.json();
}

/**
 * Logout staff
 */
function logoutStaff() {
    localStorage.removeItem(JWT_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    window.location.href = './login.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if logged in and has valid token
    const token = localStorage.getItem(JWT_TOKEN_KEY);
    const userData = localStorage.getItem(USER_DATA_KEY);
    
    if (!token || !userData) {
        window.location.href = './login.html';
        return;
    }

    const user = JSON.parse(userData);
    console.log('Dashboard loaded for:', user.fullName, 'Role:', user.role);
});

// ==================== TAB NAVIGATION ====================

function switchTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(tabName).classList.add('active');
    
    // Update active button
    document.querySelectorAll('.nav-tabs button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load data for specific tabs
    if (tabName === 'dashboard') {
        loadDashboard();
    } else if (tabName === 'clinic') {
        loadClinicInfo();
    } else if (tabName === 'emergency') {
        loadEmergencyContacts();
    }
}

// ==================== DASHBOARD ====================

function loadDashboard() {
    apiCall(`${API_BASE}/analytics/stats`)
        .then(data => {
            if (data && data.success) {
                document.getElementById('ordersToday').textContent = data.stats.totalOrders || 0;
                document.getElementById('pendingOrders').textContent = data.stats.pendingOrders || 0;
                document.getElementById('deliveredToday').textContent = data.stats.deliveredOrders || 0;
                document.getElementById('activeDrones').textContent = data.stats.availableDrones || 0;
                
                loadDroneStatus();
            }
        })
        .catch(err => console.error('Error loading dashboard:', err));
}

function loadDroneStatus() {
    apiCall(`${API_BASE}/drones`)
        .then(data => {
            if (data && data.success) {
                const tbody = document.querySelector('#droneTable tbody');
                tbody.innerHTML = data.drones.map(drone => `
                    <tr>
                        <td><strong>${drone.droneId}</strong></td>
                        <td><span class="badge badge-${drone.status}">${drone.status.replace('-', ' ').toUpperCase()}</span></td>
                        <td>🔋 ${drone.batteryLevel}%</td>
                        <td>${drone.maxPayload} kg</td>
                        <td>${drone.deliveries || 0}</td>
                    </tr>
                `).join('');
            }
        })
        .catch(err => console.error('Error loading drones:', err));
}

// ==================== STUDENT REGISTRATION ====================

function registerStudent(event) {
    event.preventDefault();
    
    const data = {
        fullName: document.getElementById('fullName').value,
        studentId: document.getElementById('studentId').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        hostelAddress: document.getElementById('hostelAddress').value,
        emergencyContact: {
            name: document.getElementById('emergencyName').value,
            phone: document.getElementById('emergencyPhone').value
        }
    };
    
    fetch(`${API_BASE}/students/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('✅ Registration successful! Your Student ID: ' + data.student.studentId);
            document.getElementById('registerForm').reset();
        } else {
            alert('❌ ' + data.message);
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('❌ Registration failed');
    });
}

// ==================== PLACE ORDER ====================

function loadMedicines() {
    fetch(`${API_BASE}/clinic/medicines`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const select = document.getElementById('medicineSelect');
                select.innerHTML = '<option value="">Choose a medicine...</option>' + 
                    data.medicines.map(med => `
                        <option value="${med.id}" data-price="${med.price}">${med.name} - $${med.price}</option>
                    `).join('');
            }
        })
        .catch(err => console.error('Error loading medicines:', err));
}

function placeOrder(event) {
    event.preventDefault();
    
    const studentId = document.getElementById('orderStudentId').value;
    const medicineId = document.getElementById('medicineSelect').value;
    const medicineName = document.getElementById('medicineSelect').options[document.getElementById('medicineSelect').selectedIndex].text;
    const quantity = parseInt(document.getElementById('quantity').value);
    const urgency = document.getElementById('urgency').value;
    const notes = document.getElementById('notes').value;
    const prescription = document.getElementById('prescription').files[0];
    
    if (!studentId || !medicineId) {
        alert('❌ Please fill in all required fields');
        return;
    }
    
    const data = {
        studentId,
        medicines: [{
            medicineId,
            name: medicineName,
            quantity,
            price: parseFloat(document.getElementById('medicineSelect').options[document.getElementById('medicineSelect').selectedIndex].dataset.price)
        }],
        deliveryLocation: 'Hostel/Campus Address',
        urgency,
        notes,
        prescriptionFile: prescription ? prescription.name : null
    };
    
    fetch(`${API_BASE}/orders/place`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert(`✅ Order placed! Order ID: ${data.order.orderId}\n\nEstimated Delivery: ${data.order.estimatedTime}`);
            document.getElementById('orderForm').reset();
        } else {
            alert('❌ ' + data.message);
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('❌ Failed to place order');
    });
}

// ==================== TRACK ORDER ====================

function trackOrder() {
    const orderId = document.getElementById('trackOrderId').value;
    
    if (!orderId) {
        alert('❌ Please enter an Order ID');
        return;
    }
    
    fetch(`${API_BASE}/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const order = data.order;
                const detailsDiv = document.getElementById('trackingDetails');
                
                let timelineHTML = `
                    <div style="margin-top: 20px; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
                        <h4>Order Details</h4>
                        <p><strong>Order ID:</strong> ${order.orderId}</p>
                        <p><strong>Status:</strong> <span class="badge badge-${order.orderStatus}">${order.orderStatus.toUpperCase()}</span></p>
                        <p><strong>Student:</strong> ${order.studentName}</p>
                        <p><strong>Medicines:</strong> ${order.medicines.map(m => m.name).join(', ')}</p>
                        <p><strong>Total Price:</strong> $${order.totalPrice.toFixed(2)}</p>
                        <p><strong>Delivery Location:</strong> ${order.deliveryLocation}</p>
                        <p><strong>Urgency:</strong> ${order.urgency.toUpperCase()}</p>
                        <p><strong>Estimated Time:</strong> ${order.estimatedTime}</p>
                        
                        <div class="timeline" style="margin-top: 20px;">
                            <div class="timeline-item">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <h4>Order Placed</h4>
                                    <p>${new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            ${order.approvalTime ? `
                            <div class="timeline-item">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <h4>Approved by Staff</h4>
                                    <p>${new Date(order.approvalTime).toLocaleString()}</p>
                                </div>
                            </div>
                            ` : ''}
                            ${order.droneAssigned ? `
                            <div class="timeline-item">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <h4>Drone Assigned & Launched</h4>
                                    <p>Drone ID: ${order.droneAssigned}</p>
                                </div>
                            </div>
                            ` : ''}
                            ${order.deliveredAt ? `
                            <div class="timeline-item">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <h4>Delivered</h4>
                                    <p>${new Date(order.deliveredAt).toLocaleString()}</p>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                `;
                
                detailsDiv.innerHTML = timelineHTML;
            } else {
                document.getElementById('trackingDetails').innerHTML = '<p style="color: red;">❌ Order not found</p>';
            }
        })
        .catch(err => {
            console.error('Error:', err);
            document.getElementById('trackingDetails').innerHTML = '<p style="color: red;">❌ Error fetching order</p>';
        });
}

// ==================== CLINIC INFO ====================

function loadClinicInfo() {
    // Load medicines
    fetch(`${API_BASE}/clinic/medicines`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const tbody = document.querySelector('#medicineTable tbody');
                tbody.innerHTML = data.medicines.map(med => `
                    <tr>
                        <td><strong>${med.name}</strong></td>
                        <td>${med.dosage}</td>
                        <td>${med.stock} units</td>
                        <td>${med.maxDosage}</td>
                        <td><button class="btn btn-sm" onclick="showMedicineDetails('${med.id}')">Learn More</button></td>
                    </tr>
                `).join('');
            }
        })
        .catch(err => console.error('Error loading medicines:', err));
}

// ==================== EMERGENCY CONTACTS ====================

function loadEmergencyContacts() {
    // Load JPP Contacts
    fetch(`${API_BASE}/emergency/jpp`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const jppDiv = document.getElementById('jppContacts');
                jppDiv.innerHTML = data.jppContacts.map(contact => `
                    <div class="card">
                        <h3>${contact.name}</h3>
                        <p><strong>${contact.title}</strong></p>
                        <p>📞 <strong>${contact.phone}</strong></p>
                        <p>📧 ${contact.email}</p>
                        <p>🏠 ${contact.hostelBlock}</p>
                        <p style="color: #667eea; font-size: 12px; margin-top: 8px;">⏰ ${contact.availability}</p>
                    </div>
                `).join('');
            }
        })
        .catch(err => console.error('Error loading JPP contacts:', err));

    // Load Clinic Emergency Contacts
    fetch(`${API_BASE}/emergency/clinic`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const clinicDiv = document.getElementById('clinicEmergency');
                clinicDiv.innerHTML = data.clinicContacts.map(contact => `
                    <div class="card">
                        <h3>${contact.name}</h3>
                        <p><strong>${contact.title}</strong></p>
                        <p>📞 <strong>${contact.phone}</strong></p>
                        ${contact.emergencyLine ? `<p>🚨 Emergency: <strong>${contact.emergencyLine}</strong></p>` : ''}
                        <p>📧 ${contact.email}</p>
                        ${contact.operatingHours ? `<p>⏰ ${contact.operatingHours}</p>` : ''}
                        ${contact.location ? `<p>📍 ${contact.location}</p>` : ''}
                    </div>
                `).join('');
            }
        })
        .catch(err => console.error('Error loading clinic contacts:', err));

    // Load Security Contacts
    fetch(`${API_BASE}/emergency/security`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const secDiv = document.getElementById('securityContacts');
                secDiv.innerHTML = data.securityContacts.map(contact => `
                    <div class="card">
                        <h3>${contact.name}</h3>
                        <p><strong>${contact.title}</strong></p>
                        <p>📞 <strong>${contact.phone}</strong></p>
                        <p>📧 ${contact.email}</p>
                        ${contact.location ? `<p>📍 ${contact.location}</p>` : ''}
                        <p style="color: #667eea; font-size: 12px; margin-top: 8px;">⏰ ${contact.availability}</p>
                    </div>
                `).join('');
            }
        })
        .catch(err => console.error('Error loading security contacts:', err));

    // Load Emergency Services
    fetch(`${API_BASE}/emergency/services`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const servDiv = document.getElementById('emergencyServices');
                servDiv.innerHTML = data.services.map(service => `
                    <div class="card" style="border-top: 3px solid #f44;">
                        <h3>${service.name}</h3>
                        <p><strong>${service.title}</strong></p>
                        <p style="color: #f44; font-weight: bold; font-size: 16px;">📞 ${service.phone}</p>
                        <p>📧 ${service.email}</p>
                        ${service.location ? `<p>📍 ${service.location}</p>` : ''}
                        <p style="color: #667eea; font-size: 12px; margin-top: 8px;">⏰ ${service.availability}</p>
                    </div>
                `).join('');
            }
        })
        .catch(err => console.error('Error loading emergency services:', err));

    // Load Admin Contacts
    fetch(`${API_BASE}/emergency/admin`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const adminDiv = document.getElementById('adminContacts');
                adminDiv.innerHTML = data.adminContacts.map(contact => `
                    <div class="card">
                        <h3>${contact.name}</h3>
                        <p><strong>${contact.title}</strong></p>
                        <p>📞 ${contact.phone}</p>
                        <p>📧 ${contact.email}</p>
                        <p>🏢 ${contact.office}</p>
                        <p style="color: #667eea; font-size: 12px; margin-top: 8px;">⏰ ${contact.availability}</p>
                    </div>
                `).join('');
            }
        })
        .catch(err => console.error('Error loading admin contacts:', err));
}

// ==================== STAFF LOGIN & PORTAL ====================

function handleStaffLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('staffUsername').value;
    const password = document.getElementById('staffPassword').value;
    
    fetch(`${API_BASE}/staff/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Store staff session
            currentStaffToken = data.token;
            currentStaffId = data.staff.id;
            
            // Update UI
            document.getElementById('staffLoginSection').style.display = 'none';
            document.getElementById('staffDashboardSection').style.display = 'block';
            document.getElementById('staffNameDisplay').textContent = data.staff.fullName;
            document.getElementById('staffRoleDisplay').textContent = data.staff.role;
            
            // Load orders
            loadStaffOrders();
            
            // Load stats
            updateStaffStats();
        } else {
            alert('❌ ' + (data.message || 'Login failed'));
        }
    })
    .catch(err => {
        console.error('Login error:', err);
        alert('❌ Connection error');
    });
}

function handleStaffLogout() {
    if (confirm('Are you sure you want to logout?')) {
        currentStaffToken = null;
        currentStaffId = null;
        document.getElementById('staffLoginSection').style.display = 'block';
        document.getElementById('staffDashboardSection').style.display = 'none';
        document.getElementById('staffLoginForm').reset();
    }
}

// ==================== STAFF ORDER MANAGEMENT ====================

let allOrders = [];
let currentFilterStatus = 'all';
let currentOrderId = null;

function loadStaffOrders() {
    fetch(`${API_BASE}/orders`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                allOrders = data.orders;
                displayOrders(allOrders);
                updateStaffStats();
            }
        })
        .catch(err => console.error('Error loading orders:', err));
}

function displayOrders(ordersToShow) {
    const tbody = document.getElementById('ordersTableBody');
    
    if (ordersToShow.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 30px; color: #999;">No orders found</td></tr>';
        return;
    }
    
    tbody.innerHTML = ordersToShow.map(order => `
        <tr>
            <td><strong>${order.orderId}</strong></td>
            <td>${order.studentName}</td>
            <td>${order.medicines.length} item(s)</td>
            <td>RM ${order.totalPrice.toFixed(2)}</td>
            <td>
                <span class="badge badge-${order.orderStatus}">
                    ${order.orderStatus === 'new' ? '🆕 New' : 
                      order.orderStatus === 'approved' ? '✅ Approved' : 
                      order.orderStatus === 'sent' ? '🚁 In Transit' : 
                      order.orderStatus === 'delivered' ? '✔️ Delivered' : 
                      order.orderStatus.toUpperCase()}
                </span>
            </td>
            <td>
                <span class="badge" style="background: ${order.urgency === 'emergency' ? '#ffebee' : order.urgency === 'urgent' ? '#fff3e0' : '#e8f5e9'}; color: ${order.urgency === 'emergency' ? '#d32f2f' : order.urgency === 'urgent' ? '#f57c00' : '#388e3c'};">
                    ${order.urgency.toUpperCase()}
                </span>
            </td>
            <td style="font-size: 12px; color: #999;">${new Date(order.createdAt).toLocaleTimeString()}</td>
            <td>
                <button class="btn btn-sm" style="background: #00a86b; color: white;" onclick="viewOrderDetails('${order.orderId}')">
                    View
                </button>
            </td>
        </tr>
    `).join('');
}

function filterOrders(status) {
    currentFilterStatus = status;
    
    // Update active button
    document.querySelectorAll('[onclick^="filterOrders"]').forEach(btn => {
        btn.style.background = '';
        btn.style.color = '';
    });
    event.target.style.background = '#00a86b';
    event.target.style.color = 'white';
    
    // Filter and display
    const filtered = status === 'all' ? allOrders : allOrders.filter(o => o.orderStatus === status);
    displayOrders(filtered);
}

function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o.orderId === orderId);
    if (!order) return;
    
    currentOrderId = orderId;
    
    // Populate modal
    document.getElementById('modalOrderId').textContent = order.orderId;
    document.getElementById('modalStudentName').textContent = order.studentName;
    document.getElementById('modalStudentId').textContent = order.studentId;
    document.getElementById('modalStudentEmail').textContent = order.studentEmail || 'N/A';
    document.getElementById('modalStudentPhone').textContent = order.studentPhone || 'N/A';
    document.getElementById('modalUrgency').textContent = order.urgency.toUpperCase();
    document.getElementById('modalDeliveryLocation').textContent = order.deliveryLocation;
    document.getElementById('modalTimeCreated').textContent = new Date(order.createdAt).toLocaleString();
    document.getElementById('modalNotes').textContent = order.notes || 'No special notes provided';
    document.getElementById('modalTotalPrice').textContent = `RM ${order.totalPrice.toFixed(2)}`;
    
    // Status badge
    const statusBadge = document.getElementById('modalOrderStatus');
    statusBadge.textContent = order.orderStatus === 'new' ? '🆕 New' : 
                             order.orderStatus === 'approved' ? '✅ Approved' : 
                             order.orderStatus === 'sent' ? '🚁 In Transit' : 
                             order.orderStatus === 'delivered' ? '✔️ Delivered' : 
                             order.orderStatus;
    
    // Medicines
    const medicinesList = document.getElementById('modalMedicinesList');
    medicinesList.innerHTML = order.medicines.map(med => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${med.name}</td>
            <td style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">${med.quantity}</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">RM ${(med.price * med.quantity).toFixed(2)}</td>
        </tr>
    `).join('');
    
    // Show/hide action buttons based on status
    const approveBtn = document.getElementById('approveBtn');
    const rejectBtn = document.getElementById('rejectBtn');
    const assignDroneBtn = document.getElementById('assignDroneBtn');
    
    approveBtn.style.display = order.orderStatus === 'new' ? 'block' : 'none';
    rejectBtn.style.display = order.orderStatus === 'new' ? 'block' : 'none';
    assignDroneBtn.style.display = order.orderStatus === 'approved' ? 'block' : 'none';
    document.getElementById('droneAssignmentUI').style.display = 'none';
    
    // Show modal
    document.getElementById('orderDetailsModal').classList.add('active');
}

function closeOrderModal() {
    document.getElementById('orderDetailsModal').classList.remove('active');
    currentOrderId = null;
}

function approveOrder() {
    if (!currentOrderId || !currentStaffId) return;
    
    fetch(`${API_BASE}/orders/${currentOrderId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId: currentStaffId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('✅ Order approved successfully!');
            closeOrderModal();
            loadStaffOrders();
        } else {
            alert('❌ ' + (data.message || 'Failed to approve'));
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('❌ Connection error');
    });
}

function rejectOrder() {
    if (!currentOrderId) return;
    
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    fetch(`${API_BASE}/orders/${currentOrderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejectionReason: reason })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('✅ Order rejected');
            closeOrderModal();
            loadStaffOrders();
        }
    })
    .catch(err => console.error('Error:', err));
}

function showDroneAssignment() {
    document.getElementById('droneAssignmentUI').style.display = 'block';
    
    // Load available drones
    fetch(`${API_BASE}/drones`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const select = document.getElementById('droneSelect');
                select.innerHTML = data.drones
                    .filter(d => d.currentStatus === 'available')
                    .map(d => `<option value="${d.id}">${d.droneId} (Battery: ${d.batteryLevel}%)</option>`)
                    .join('');
            }
        })
        .catch(err => console.error('Error loading drones:', err));
}

function confirmDroneAssignment() {
    const droneId = document.getElementById('droneSelect').value;
    if (!droneId || !currentOrderId) {
        alert('Please select a drone');
        return;
    }
    
    fetch(`${API_BASE}/orders/${currentOrderId}/assign-drone`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ droneId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('✅ Drone assigned and order dispatched!');
            closeOrderModal();
            loadStaffOrders();
        } else {
            alert('❌ ' + (data.message || 'Failed to assign drone'));
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('❌ Connection error');
    });
}

function updateStaffStats() {
    if (allOrders.length === 0) return;
    
    const stats = {
        pending: allOrders.filter(o => o.orderStatus === 'new').length,
        approved: allOrders.filter(o => o.orderStatus === 'approved').length,
        inTransit: allOrders.filter(o => o.orderStatus === 'sent').length,
        delivered: allOrders.filter(o => o.orderStatus === 'delivered').length
    };
    
    document.getElementById('statPending').textContent = stats.pending;
    document.getElementById('statApproved').textContent = stats.approved;
    document.getElementById('statInTransit').textContent = stats.inTransit;
    document.getElementById('statDelivered').textContent = stats.delivered;
}

// ==================== MEDICINE DETAILS ====================

function showMedicineDetails(medicineId) {
    fetch(`${API_BASE}/medicines`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const medicine = data.medicines.find(m => m.id === medicineId);
                if (medicine) {
                    document.getElementById('modalMedicineName').textContent = medicine.name;
                    document.getElementById('modalDosage').textContent = medicine.dosage;
                    document.getElementById('modalCategory').textContent = medicine.category.replace('-', ' ').toUpperCase();
                    document.getElementById('modalStock').textContent = medicine.stock + ' units in stock';
                    document.getElementById('modalExpiry').textContent = medicine.expiryDate;
                    document.getElementById('modalMaxDosage').textContent = medicine.maxDosage;
                    document.getElementById('modalExplanation').textContent = medicine.explanation;
                    document.getElementById('modalInstructions').textContent = medicine.specialInstructions;
                    
                    document.getElementById('medicineModal').classList.add('active');
                }
            }
        })
        .catch(err => console.error('Error:', err));
}

function closeMedicineModal() {
    document.getElementById('medicineModal').classList.remove('active');
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    loadMedicines();
    loadDashboard();
});


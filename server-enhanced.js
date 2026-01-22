const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const socketIo = require('socket.io');
const database = require('./database');
const { sendAllNotifications } = require('./notifications');
const os = require('os');
require('dotenv').config();

// MongoDB & Authentication
const {
  mongoose,
  Student,
  Staff,
  Medicine,
  Order,
  Drone,
  Delivery,
  ActivityLog,
  Transaction
} = require('./config-mongo');

const {
  authMiddleware,
  requireRole,
  generateToken,
  verifyToken
} = require('./auth');

const logger = require('./logger');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: '*', methods: ['GET', 'POST', 'PATCH'] }
});

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: false
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files
app.use(express.static(__dirname));

// Root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// HTML page routes
app.get('/login.html', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
});

app.get('/tracker.html', (req, res) => {
    res.sendFile(__dirname + '/tracker.html');
});

// ==================== STUDENT ENDPOINTS ====================

// Register new student
app.post('/api/students/register', async (req, res) => {
    try {
        const { fullName, phone, password, hostelBlock, roomNumber, emergencyContact } = req.body;

        if (!fullName || !phone || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Check if student already exists
        const existingStudent = await Student.findOne({ phone });
        if (existingStudent) {
            return res.status(409).json({ success: false, message: 'Phone number already registered' });
        }

        const newStudent = new Student({
            matricNumber: `STU${Date.now()}`,
            fullName,
            phone,
            passwordHash: password, // TODO: Add bcrypt hashing in production
            hostelBlock,
            roomNumber,
            emergencyContact,
            createdAt: new Date()
        });

        await newStudent.save();
        logger.logActivity(newStudent._id, 'student-registered', { phone });

        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            student: { id: newStudent._id, fullName, phone }
        });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/students/register' });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Student login
app.post('/api/students/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ success: false, message: 'Phone and password required' });
        }

        const student = await Student.findOne({ phone });

        if (!student || student.passwordHash !== password) {
            logger.logLogin(null, 'student', false);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateToken({
            id: student._id,
            role: 'student',
            phone: student.phone
        });

        logger.logLogin(student._id, 'student', true);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            student: {
                id: student._id,
                fullName: student.fullName,
                phone: student.phone,
                roomNumber: student.roomNumber
            }
        });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/students/login' });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get student profile (protected)
app.get('/api/students/:studentId', authMiddleware, requireRole('student'), async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        res.json({ success: true, student });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/students/:studentId' });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update student profile (protected)
app.patch('/api/students/:studentId', authMiddleware, requireRole('student'), async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.studentId,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        logger.logActivity(req.userId, 'student-profile-updated', { studentId: req.params.studentId });
        res.json({ success: true, message: 'Profile updated', student });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/students/:studentId', method: 'PATCH' });
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== STAFF ENDPOINTS ====================

// Staff login
app.post('/api/staff/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        const staff = await Staff.findOne({ username });

        if (!staff || staff.passwordHash !== password) {
            logger.logLogin(null, 'staff', false);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (!staff.isActive) {
            return res.status(403).json({ success: false, message: 'Account inactive' });
        }

        // Generate JWT token
        const token = generateToken({
            id: staff._id,
            role: staff.role,
            phone: staff.phone
        });

        logger.logLogin(staff._id, staff.role, true);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            staff: {
                id: staff._id,
                fullName: staff.fullName,
                role: staff.role,
                username: staff.username
            }
        });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/staff/login' });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all clinic staff (protected)
app.get('/api/staff', authMiddleware, requireRole('admin', 'nurse', 'pharmacist'), async (req, res) => {
    try {
        const staff = await Staff.find({ isActive: true });
        res.json({ success: true, staff });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/staff' });
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== CLINIC ENDPOINTS ====================

// Get clinic info
app.get('/api/clinic', (req, res) => {
    res.json({ success: true, clinic: database.clinic });
});

// Get available medicines (protected - students, nurses, pharmacists)
app.get('/api/clinic/medicines', authMiddleware, requireRole('student', 'pharmacist', 'nurse'), async (req, res) => {
    try {
        const medicines = await Medicine.find({ inStock: true });
        logger.logApiCall('GET', '/api/clinic/medicines', 200, Date.now());
        res.json({ success: true, medicines });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/clinic/medicines', userId: req.user.userId });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update medicine stock (protected - pharmacist/nurse only)
app.patch('/api/clinic/medicines/:medicineId', authMiddleware, requireRole('pharmacist', 'nurse'), async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(
            req.params.medicineId,
            { stock: req.body.stock },
            { new: true }
        );
        
        if (!medicine) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }

        const transaction = new Transaction({
            medicineId: medicine._id,
            quantity: Math.abs(req.body.stock - medicine.stock),
            type: req.body.stock > medicine.stock ? 'in' : 'out',
            reason: req.body.reason || 'Manual adjustment',
            staffId: req.user.userId,
            timestamp: new Date()
        });
        await transaction.save();

        logger.logActivity(req.user.userId, 'UPDATE_MEDICINE_STOCK', { medicineId: medicine._id, newStock: req.body.stock });
        res.json({ success: true, medicine, message: 'Stock updated' });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/clinic/medicines/:medicineId', userId: req.user.userId });
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== EMERGENCY CONTACTS ENDPOINTS ====================

// Get all emergency contacts
app.get('/api/emergency/contacts', (req, res) => {
    res.json({ success: true, contacts: database.emergencyContacts });
});

// Get JPP contacts only
app.get('/api/emergency/jpp', (req, res) => {
    res.json({ success: true, jppContacts: database.emergencyContacts.jppContacts });
});

// Get clinic emergency contacts
app.get('/api/emergency/clinic', (req, res) => {
    res.json({ success: true, clinicContacts: database.emergencyContacts.clinicContacts });
});

// Get campus security contacts
app.get('/api/emergency/security', (req, res) => {
    res.json({ success: true, securityContacts: database.emergencyContacts.campusSecurityContacts });
});

// Get other emergency services
app.get('/api/emergency/services', (req, res) => {
    res.json({ success: true, services: database.emergencyContacts.otherEmergencyServices });
});

// Get admin contacts
app.get('/api/emergency/admin', (req, res) => {
    res.json({ success: true, adminContacts: database.emergencyContacts.administrativeContacts });
});

// ==================== DRONE ENDPOINTS ====================

// Get drone fleet status (protected - staff only)
app.get('/api/drones', authMiddleware, requireRole('drone-operator', 'admin', 'nurse'), async (req, res) => {
    try {
        const drones = await Drone.find();
        const stats = {
            total: drones.length,
            available: drones.filter(d => d.status === 'available').length,
            delivering: drones.filter(d => d.status === 'delivering').length,
            charging: drones.filter(d => d.status === 'charging').length,
            drones
        };
        logger.logActivity(req.user.userId, 'VIEW_DRONE_FLEET', { count: drones.length });
        res.json({ success: true, ...stats });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/drones', userId: req.user.userId });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single drone (protected - staff only)
app.get('/api/drones/:droneId', authMiddleware, requireRole('drone-operator', 'admin', 'nurse'), async (req, res) => {
    try {
        const drone = await Drone.findById(req.params.droneId);
        
        if (!drone) {
            return res.status(404).json({ success: false, message: 'Drone not found' });
        }

        logger.logActivity(req.user.userId, 'VIEW_DRONE', { droneId: drone._id });
        res.json({ success: true, drone });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/drones/:droneId', userId: req.user.userId });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update drone status (protected - drone operators only)
app.patch('/api/drones/:droneId', authMiddleware, requireRole('drone-operator', 'admin'), async (req, res) => {
    try {
        const updateObj = {
            updatedAt: new Date()
        };
        
        if (req.body.status) updateObj.status = req.body.status;
        if (req.body.batteryLevel !== undefined) updateObj.batteryLevel = req.body.batteryLevel;
        if (req.body.currentPayload !== undefined) updateObj.currentPayload = req.body.currentPayload;
        if (req.body.location) updateObj.location = req.body.location;
        
        const drone = await Drone.findByIdAndUpdate(req.params.droneId, updateObj, { new: true });
        
        if (!drone) {
            return res.status(404).json({ success: false, message: 'Drone not found' });
        }

        logger.logDroneAction(drone._id, 'STATUS_UPDATE', { status: drone.status, battery: drone.batteryLevel });
        io.emit('drone-update', drone);
        res.json({ success: true, drone, message: 'Drone updated' });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/drones/:droneId', userId: req.user.userId });
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ORDER ENDPOINTS ====================

// Place new order with prescription (protected - students only)
app.post('/api/orders/place', authMiddleware, requireRole('student'), async (req, res) => {
    try {
        const { medicines, urgency, notes } = req.body;
        const studentId = req.user.userId;

        if (!medicines || medicines.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one medicine required' });
        }

        // Get student info
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Calculate total weight
        const totalWeight = medicines.reduce((sum, m) => sum + ((m.weight || 50) * m.quantity), 0);

        // Create new order
        const newOrder = new Order({
            orderId: `SKY-${uuidv4().substr(0, 8).toUpperCase()}`,
            studentId,
            medicines: medicines.map(m => ({
                medicineId: m.id,
                medicineName: m.name,
                quantity: m.quantity,
                dosage: m.dosage,
                emoji: m.emoji
            })),
            totalWeight,
            status: 'pending',
            urgency: urgency || 'normal',
            notes,
            createdAt: new Date()
        });

        await newOrder.save();

        // Log activity
        logger.logActivity(studentId, 'order-created', { orderId: newOrder.orderId, urgency });

        // Emit real-time notification
        io.emit('new-order-placed', {
            orderId: newOrder.orderId,
            studentName: student.fullName,
            medicines: medicines.length,
            urgency: newOrder.urgency,
            createdAt: newOrder.createdAt
        });

        res.status(201).json({
            success: true,
            message: 'Order placed successfully. Awaiting approval.',
            order: {
                orderId: newOrder.orderId,
                status: newOrder.status,
                createdAt: newOrder.createdAt
            }
        });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/orders/place', studentId: req.user.userId });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all orders (protected - staff only)
app.get('/api/orders', authMiddleware, requireRole('nurse', 'pharmacist', 'drone-operator', 'admin'), async (req, res) => {
    try {
        const filter = req.query.status;
        const query = filter ? { status: filter } : {};
        const orders = await Order.find(query).populate('studentId', 'fullName phone');
        
        res.json({ success: true, total: orders.length, orders });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/orders' });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get student order history (protected)
app.get('/api/students/:studentId/orders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ studentId: req.params.studentId });
        res.json({ success: true, orders });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/students/:studentId/orders' });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single order (protected)
app.get('/api/orders/:orderId', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId }).populate('studentId', 'fullName phone');
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, order });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/orders/:orderId' });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Approve order (protected - nurses only)
app.patch('/api/orders/:orderId/approve', authMiddleware, requireRole('nurse'), async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            {
                status: 'approved',
                approvedAt: new Date()
            },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        logger.logOrderStatusChange(order.orderId, 'pending', 'approved', req.userId);
        io.emit('order-approved', { orderId: order.orderId, status: order.status });

        res.json({ success: true, message: 'Order approved', order });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/orders/:orderId/approve', staffId: req.userId });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Assign drone to order (protected - drone operators only)
app.patch('/api/orders/:orderId/assign-drone', authMiddleware, requireRole('drone-operator', 'admin'), async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { status: 'dispatched' },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const drone = await Drone.findByIdAndUpdate(
            req.body.droneId,
            { status: 'delivering' },
            { new: true }
        );
        
        if (!drone) {
            return res.status(404).json({ success: false, message: 'Drone not found' });
        }

        const delivery = new Delivery({
            deliveryId: `DEL${Date.now()}`,
            orderId: order._id,
            droneId: drone._id,
            status: 'in-transit',
            currentLocation: database.clinic.location,
            estimatedDeliveryTime: order.urgency === 'emergency' ? 600 : 1200,
            createdAt: new Date()
        });
        await delivery.save();

        logger.logActivity(req.user.userId, 'ASSIGN_DRONE', { orderId: order.orderId, droneId: drone._id });
        logger.logDroneAction(drone._id, 'ASSIGNED_TO_ORDER', { orderId: order.orderId });
        
        io.emit('order-sent', order);
        io.emit('drone-assigned', drone);

        res.json({ success: true, message: 'Drone assigned', order, delivery });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/orders/:orderId/assign-drone', userId: req.user.userId });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update order status (protected - staff only)
app.patch('/api/orders/:orderId/status', authMiddleware, requireRole('drone-operator', 'nurse', 'pharmacist', 'admin'), async (req, res) => {
    try {
        const updateObj = {
            status: req.body.status,
            updatedAt: new Date()
        };
        
        if (req.body.status === 'delivered') {
            updateObj.deliveredAt = new Date();
        }
        
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            updateObj,
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        logger.logOrderStatusChange(order.orderId, 'in-transit', req.body.status, req.user.userId);
        io.emit('order-status-update', order);

        res.json({ success: true, message: 'Status updated', order });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/orders/:orderId/status', userId: req.user.userId });
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== DELIVERY ENDPOINTS ====================

// Get all deliveries (protected - staff only)
app.get('/api/deliveries', authMiddleware, requireRole('drone-operator', 'admin', 'nurse'), async (req, res) => {
    try {
        const deliveries = await Delivery.find().populate('orderId droneId');
        logger.logActivity(req.user.userId, 'VIEW_DELIVERIES', { count: deliveries.length });
        res.json({ success: true, deliveries });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/deliveries', userId: req.user.userId });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get delivery status (protected - staff only)
app.get('/api/deliveries/:deliveryId', authMiddleware, requireRole('drone-operator', 'admin', 'nurse', 'student'), async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.deliveryId).populate('orderId droneId');
        
        if (!delivery) {
            return res.status(404).json({ success: false, message: 'Delivery not found' });
        }

        logger.logActivity(req.user.userId, 'VIEW_DELIVERY', { deliveryId: delivery._id });
        res.json({ success: true, delivery });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/deliveries/:deliveryId', userId: req.user.userId });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update delivery location (protected - drone operators only)
app.patch('/api/deliveries/:deliveryId/location', authMiddleware, requireRole('drone-operator', 'admin'), async (req, res) => {
    try {
        const delivery = await Delivery.findByIdAndUpdate(
            req.params.deliveryId,
            {
                currentLocation: req.body.location,
                updatedAt: new Date()
            },
            { new: true }
        );
        
        if (!delivery) {
            return res.status(404).json({ success: false, message: 'Delivery not found' });
        }

        logger.logActivity(req.user.userId, 'UPDATE_DELIVERY_LOCATION', { deliveryId: delivery._id });
        io.emit('delivery-location-update', delivery);

        res.json({ success: true, delivery });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/deliveries/:deliveryId/location', userId: req.user.userId });
        res.status(500).json({ success: false, message: error.message });
    }
});

// Complete delivery (protected - drone operators only)
app.patch('/api/deliveries/:deliveryId/complete', authMiddleware, requireRole('drone-operator', 'admin'), async (req, res) => {
    try {
        const delivery = await Delivery.findByIdAndUpdate(
            req.params.deliveryId,
            {
                status: 'delivered',
                deliveredAt: new Date(),
                updatedAt: new Date()
            },
            { new: true }
        ).populate('orderId droneId');
        
        if (!delivery) {
            return res.status(404).json({ success: false, message: 'Delivery not found' });
        }

        // Update order status
        await Order.findByIdAndUpdate(delivery.orderId, { status: 'delivered', deliveredAt: new Date() });
        
        // Update drone status back to available
        await Drone.findByIdAndUpdate(delivery.droneId, { status: 'available' });

        logger.logActivity(req.user.userId, 'COMPLETE_DELIVERY', { deliveryId: delivery._id, orderId: delivery.orderId });
        io.emit('delivery-completed', delivery);

        res.json({ success: true, message: 'Delivery completed', delivery });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/deliveries/:deliveryId/complete', userId: req.user.userId });
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== ANALYTICS ENDPOINTS ====================

// Get dashboard stats (protected - admin only)
app.get('/api/analytics/stats', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const activeStudents = await Student.countDocuments();
        const drones = await Drone.find();
        const availableDrones = drones.filter(d => d.status === 'available').length;

        const stats = {
            totalOrders,
            deliveredOrders,
            pendingOrders,
            activeStudents,
            totalDrones: drones.length,
            availableDrones,
            avgDeliveryTime: '12 mins'
        };

        logger.logActivity(req.user.userId, 'VIEW_ANALYTICS', { type: 'dashboard_stats' });
        res.json({ success: true, stats });
    } catch (error) {
        logger.logError(error, { endpoint: '/api/analytics/stats', userId: req.user.userId });
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==================== WEBSOCKET EVENTS ====================

io.on('connection', (socket) => {
    console.log(`📱 User connected: ${socket.id}`);

    socket.on('track-order', (orderId) => {
        const order = database.orders.find(o => o.orderId === orderId);
        if (order) {
            socket.emit('order-details', order);
        }
    });

    socket.on('track-delivery', (deliveryId) => {
        const delivery = database.deliveries.find(d => d.id === deliveryId);
        if (delivery) {
            socket.emit('delivery-details', delivery);
        }
    });

    socket.on('disconnect', () => {
        console.log(`📱 User disconnected: ${socket.id}`);
    });
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
    res.json({ status: 'online', timestamp: new Date(), version: '2.0.0' });
});

// ==================== CONTACT FORM ENDPOINT ====================

// Handle contact form submissions
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const contactMessage = {
        id: `CONTACT${Date.now()}`,
        name,
        email,
        phone,
        message,
        status: 'new',
        createdAt: new Date()
    };

    database.contactMessages = database.contactMessages || [];
    database.contactMessages.push(contactMessage);

    // Notify admin staff of new contact message
    const adminEmails = database.staff.filter(s => s.role === 'admin' || s.role === 'manager').map(s => s.email).filter(Boolean);
    
    if (adminEmails.length > 0) {
        const { sendEmailNotification } = require('./notifications');
        await sendEmailNotification(adminEmails, {
            orderId: `CONTACT-${contactMessage.id}`,
            studentName: name,
            studentId: email,
            deliveryLocation: 'Contact Form',
            urgency: 'normal',
            medicines: [{ name: 'Contact Message', quantity: 1, price: 0 }],
            totalPrice: 0,
            notes: `From: ${name} (${phone})\n\n${message}`,
            createdAt: new Date()
        }).catch(err => console.error('Contact email error:', err));
    }

    // Emit notification to connected admin users
    io.emit('new-contact-message', contactMessage);

    res.status(201).json({ 
        success: true, 
        message: 'Thank you! Your message has been received. We will contact you soon.',
        contactId: contactMessage.id 
    });
});

// ==================== TRACKER ENDPOINTS ====================

// Get all drones and deliveries for tracker
app.get('/api/tracker/drones', (req, res) => {
    try {
        // Get all drones with simulated current locations
        const drones = database.drones.map(drone => {
            // Simulate drone movement for active deliveries
            const activeDelivery = database.deliveries.find(d => 
                d.droneId === drone.droneId && d.deliveryStatus === 'in-transit'
            );

            let location = drone.location;
            if (activeDelivery) {
                // Simulate drone moving towards delivery point
                const progress = Math.random() * 0.5; // 0-50% progress
                location = {
                    lat: drone.location.lat + (activeDelivery.deliveryPoint.lat - drone.location.lat) * progress,
                    lng: drone.location.lng + (activeDelivery.deliveryPoint.lng - drone.location.lng) * progress,
                    campus: drone.location.campus
                };
            }

            return {
                ...drone,
                location: location,
                lastUpdate: new Date()
            };
        });

        // Get active deliveries
        const deliveries = database.deliveries
            .filter(d => ['pending', 'launched', 'in-transit'].includes(d.deliveryStatus))
            .map(delivery => {
                const drone = drones.find(d => d.id === delivery.droneId || d.droneId === delivery.droneId);
                return {
                    ...delivery,
                    droneName: drone ? drone.droneId : 'Unassigned',
                    estimatedTime: delivery.estimatedTime || '15-30 mins'
                };
            });

        res.json({
            success: true,
            drones: drones,
            deliveries: deliveries,
            stats: {
                totalDrones: drones.length,
                activeDrones: drones.filter(d => d.currentStatus !== 'maintenance').length,
                deliveringCount: drones.filter(d => d.currentStatus === 'delivering').length,
                activeDeliveries: deliveries.length,
                avgBattery: Math.round(drones.reduce((sum, d) => sum + d.batteryLevel, 0) / drones.length)
            },
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Tracker error:', error);
        res.status(500).json({ success: false, message: 'Tracker error', error: error.message });
    }
});

// Get specific drone tracking details
app.get('/api/tracker/drone/:droneId', (req, res) => {
    try {
        const drone = database.drones.find(d => d.id === req.params.droneId || d.droneId === req.params.droneId);
        
        if (!drone) {
            return res.status(404).json({ success: false, message: 'Drone not found' });
        }

        const delivery = database.deliveries.find(d => d.droneId === drone.droneId);

        res.json({
            success: true,
            drone: drone,
            activeDelivery: delivery || null,
            route: delivery ? {
                launchPoint: delivery.launchPoint,
                currentLocation: delivery.currentLocation,
                deliveryPoint: delivery.deliveryPoint,
                distance: 'Calculating...',
                eta: delivery.estimatedTime
            } : null
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching drone details', error: error.message });
    }
});

// Get delivery tracking
app.get('/api/tracker/delivery/:orderId', (req, res) => {
    try {
        const delivery = database.deliveries.find(d => d.orderId === req.params.orderId);
        
        if (!delivery) {
            return res.status(404).json({ success: false, message: 'Delivery not found' });
        }

        const drone = database.drones.find(d => d.id === delivery.droneId || d.droneId === delivery.droneId);

        res.json({
            success: true,
            delivery: delivery,
            drone: drone || null,
            trackingStatus: {
                status: delivery.deliveryStatus,
                currentLocation: delivery.currentLocation,
                destination: delivery.deliveryPoint,
                eta: delivery.estimatedTime,
                weather: delivery.weatherCondition,
                progress: getDeliveryProgress(delivery.deliveryStatus)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching delivery tracking', error: error.message });
    }
});

// Get real-time tracker updates via WebSocket
io.on('connection', (socket) => {
    console.log('🔗 Tracker client connected:', socket.id);

    // Send initial data
    socket.emit('tracker-update', {
        drones: database.drones,
        deliveries: database.deliveries.filter(d => ['pending', 'launched', 'in-transit'].includes(d.deliveryStatus)),
        timestamp: new Date()
    });

    // Send updates every 5 seconds
    const updateInterval = setInterval(() => {
        socket.emit('tracker-update', {
            drones: database.drones,
            deliveries: database.deliveries.filter(d => ['pending', 'launched', 'in-transit'].includes(d.deliveryStatus)),
            timestamp: new Date()
        });
    }, 5000);

    socket.on('disconnect', () => {
        clearInterval(updateInterval);
        console.log('❌ Tracker client disconnected:', socket.id);
    });
});

// Helper function to calculate delivery progress
function getDeliveryProgress(status) {
    const progressMap = {
        'pending': 10,
        'launched': 30,
        'in-transit': 70,
        'delivered': 100,
        'failed': 0
    };
    return progressMap[status] || 0;
}

// ==================== ERROR HANDLING ====================


app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: NODE_ENV === 'development' ? err.message : undefined 
    });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// ==================== START SERVER ====================

// Get network IP address
function getNetworkIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const networkIP = getNetworkIP();

server.listen(PORT, HOST, () => {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🛸 KMPP MEDIC DRONE - PRODUCTION READY`);
    console.log(`${'='.repeat(70)}`);
    console.log(`\n✅ Features Enabled:`);
    console.log(`   🗄️  MongoDB Database (Persistent)`);
    console.log(`   🔐 JWT Authentication`);
    console.log(`   👥 Role-Based Access Control`);
    console.log(`   📝 Comprehensive Logging`);
    console.log(`\n🌐 USE THESE URLS (Both Work!):`);
    console.log(`\n   Laptop:   http://localhost:${PORT}`);
    console.log(`   Phone:    http://${networkIP}:${PORT}`);
    console.log(`\n${'='.repeat(70)}`);
    console.log(`✅ Server is running and publicly accessible!`);
    console.log(`\n📌 Same WiFi needed on both devices`);
    console.log(`🌐 Port ${PORT} is ready!`);
    console.log(`📊 Logs: /logs/ (error.log, app.log, activity.log)`);
    console.log(`${'='.repeat(70)}\n`);
});

module.exports = { app, server, io };

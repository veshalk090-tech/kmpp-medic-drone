// MongoDB Connection Configuration
// Uses MongoDB Atlas cloud database OR local MongoDB
// Connection string format: mongodb+srv://username:password@cluster.mongodb.net/dbname

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection URI
// For development: Use MongoDB Atlas cloud (free tier available)
// Or use local MongoDB: mongodb://localhost:27017/kmpp-drone-medic
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/kmpp-drone-medic';

console.log('🔗 Connecting to MongoDB...');
console.log('📍 Connection URI:', mongoUri.replace(/:[^:@]*@/, ':****@')); // Hide password

mongoose.connect(mongoUri, {
  // Removed deprecated options - mongoose 6+ uses new defaults
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
})
.catch((err) => {
  console.error('⚠️  MongoDB connection warning:', err.message);
  console.log('💡 Using in-memory fallback for development');
  console.log('📌 For production, set MONGO_URI in .env to MongoDB Atlas');
  // Don't exit - allow fallback to in-memory
});

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err.message);
});

// Define Mongoose Schemas
const studentSchema = new mongoose.Schema({
  matricNumber: { type: String, unique: true, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  hostelBlock: String,
  roomNumber: String,
  gpsLocation: {
    latitude: Number,
    longitude: Number
  },
  emergencyContact: String,
  passwordHash: String,
  createdAt: { type: Date, default: Date.now },
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  notificationPreferences: {
    sms: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true }
  }
});

const staffSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  fullName: { type: String, required: true },
  phone: String,
  email: String,
  role: { 
    type: String, 
    enum: ['nurse', 'pharmacist', 'drone-operator', 'admin'],
    required: true 
  },
  passwordHash: String,
  createdAt: { type: Date, default: Date.now },
  shift: String,
  approvalLogs: [mongoose.Schema.Types.Mixed],
  isActive: { type: Boolean, default: true }
});

const medicineSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  dosage: String,
  category: String,
  emoji: String,
  weight: { type: Number, default: 50 }, // grams
  stock: { type: Number, default: 0 },
  maxStock: { type: Number, default: 100 },
  expiry: Date,
  requiresPrescription: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  orderId: String,
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  medicines: [{
    medicineId: String,
    medicineName: String,
    quantity: Number,
    dosage: String,
    emoji: String
  }],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'preparing', 'ready-for-dispatch', 'dispatched', 'in-transit', 'delivered', 'rejected'],
    default: 'pending'
  },
  urgency: {
    type: String,
    enum: ['normal', 'urgent', 'emergency'],
    default: 'normal'
  },
  totalWeight: { type: Number, default: 0 }, // grams
  prescriptionId: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  approvedAt: Date,
  preparedAt: Date,
  dispatchedAt: Date,
  deliveredAt: Date,
  rejectionReason: String,
  estimatedDeliveryTime: String,
  actualDeliveryTime: String
});

const droneSchema = new mongoose.Schema({
  droneId: String,
  name: String,
  status: { 
    type: String, 
    enum: ['available', 'flying', 'charging', 'maintenance', 'emergency-stopped', 'grounded'],
    default: 'available'
  },
  batteryLevel: { type: Number, default: 100 },
  maxPayload: { type: Number, default: 2000 }, // grams
  currentPayload: { type: Number, default: 0 },
  location: {
    latitude: Number,
    longitude: Number
  },
  lastMaintenance: Date,
  assignedOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  createdAt: { type: Date, default: Date.now }
});

const deliverySchema = new mongoose.Schema({
  deliveryId: String,
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  droneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drone' },
  operatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  status: { 
    type: String, 
    enum: ['assigned', 'launched', 'in-transit', 'arrived', 'delivered', 'aborted'],
    default: 'assigned'
  },
  startLocation: {
    latitude: Number,
    longitude: Number
  },
  destinationLocation: {
    latitude: Number,
    longitude: Number
  },
  estimatedTime: Number, // minutes
  actualTime: Number,
  route: [{ latitude: Number, longitude: Number }],
  gpsUpdates: [{
    latitude: Number,
    longitude: Number,
    batteryLevel: Number,
    timestamp: Date
  }],
  eta: Date,
  createdAt: { type: Date, default: Date.now },
  completedAt: Date
});

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  userRole: String,
  action: String, // 'login', 'order-created', 'order-approved', 'drone-launched', etc.
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  timestamp: { type: Date, default: Date.now }
});

const transactionSchema = new mongoose.Schema({
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
  medicineName: String,
  quantity: Number,
  type: { 
    type: String, 
    enum: ['in', 'out', 'adjustment', 'expired'],
    required: true 
  },
  reason: String,
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  staffName: String,
  notes: String,
  timestamp: { type: Date, default: Date.now }
});

// Create models
const Student = mongoose.model('Student', studentSchema);
const Staff = mongoose.model('Staff', staffSchema);
const Medicine = mongoose.model('Medicine', medicineSchema);
const Order = mongoose.model('Order', orderSchema);
const Drone = mongoose.model('Drone', droneSchema);
const Delivery = mongoose.model('Delivery', deliverySchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// Export all models
module.exports = {
  mongoose,
  Student,
  Staff,
  Medicine,
  Order,
  Drone,
  Delivery,
  ActivityLog,
  Transaction
};

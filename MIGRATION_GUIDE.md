# 📦 DATA MIGRATION & SERVER UPDATE GUIDE

**Status:** Ready to execute once .env is configured  
**Timeline:** ~2 hours (after .env setup)

---

## 🎯 What Happens During Migration

### Phase A: Backup Current Data (10 minutes)
1. ✅ Save current student/staff/medicine data
2. ✅ Create backup JSON files
3. ✅ No data lost

### Phase B: Update server-enhanced.js (45 minutes)
1. ✅ Import MongoDB models from config-mongo.js
2. ✅ Import JWT auth functions from auth.js
3. ✅ Import logger from logger.js
4. ✅ Update all endpoints to use MongoDB
5. ✅ Add authentication to protected routes
6. ✅ Add logging to all API calls

### Phase C: Migrate Data to MongoDB (15 minutes)
1. ✅ Load existing data from database.js
2. ✅ Insert into MongoDB collections
3. ✅ Verify all records inserted
4. ✅ Create indexes for performance

### Phase D: Test Everything (30 minutes)
1. ✅ Start server
2. ✅ Test student registration
3. ✅ Test staff login
4. ✅ Test order creation
5. ✅ Restart server
6. ✅ Verify data persists
7. ✅ Check log files created

### Phase E: Update Frontend (10 minutes)
1. ✅ Update app.js to send JWT tokens
2. ✅ Update login.html to store tokens
3. ✅ Update dashboard.html to use tokens
4. ✅ Test all user flows

---

## 🔄 Endpoint Updates Required

### Authentication Changes

**OLD (No auth):**
```javascript
app.post('/api/orders/place', (req, res) => {
  // No check - anyone could place orders!
});
```

**NEW (With auth):**
```javascript
app.post('/api/orders/place', authMiddleware, requireRole('student'), (req, res) => {
  const studentId = req.user.userId;
  const userRole = req.user.role;
  // Only students can place orders
});
```

---

## 📝 Endpoints to Update

### 📚 Student Endpoints
| Endpoint | Old | New | Status |
|----------|-----|-----|--------|
| POST /api/students/register | ✅ Public | ✅ Public | Keep public |
| POST /api/students/login | ✅ Public | ✅ Public | Keep public |
| POST /api/students/verify-otp | New | ✅ Protected | Add OTP check |
| GET /api/students/profile | ❌ No auth | ✅ Student only | Add auth |
| POST /api/orders/place | ❌ No auth | ✅ Student only | Add auth |
| GET /api/orders/my-orders | ❌ No auth | ✅ Student only | Add auth |
| GET /api/orders/:id | ❌ No auth | ✅ Student/Staff | Add auth |

### 👨‍⚕️ Staff Endpoints
| Endpoint | Old | New | Status |
|----------|-----|-----|--------|
| POST /api/staff/login | ✅ Public | ✅ Public | Keep public |
| GET /api/orders/pending | ❌ No auth | ✅ Nurse only | Add auth |
| PATCH /api/orders/:id/approve | ❌ No auth | ✅ Nurse only | Add auth |
| PATCH /api/orders/:id/reject | ❌ No auth | ✅ Nurse only | Add auth |
| GET /api/medicines | ❌ No auth | ✅ Pharmacist only | Add auth |
| PATCH /api/drones/:id/assign | ❌ No auth | ✅ Operator only | Add auth |
| POST /api/drones/:id/launch | ❌ No auth | ✅ Operator only | Add auth |

### 🔐 Admin Endpoints
| Endpoint | New | Status |
|----------|-----|--------|
| GET /api/admin/logs | New | ✅ Admin only |
| GET /api/admin/stock-report | New | ✅ Admin only |
| GET /api/admin/analytics | New | ✅ Admin only |

---

## 🔧 Code Changes Needed

### 1. server-enhanced.js Header
**Add these imports:**
```javascript
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

require('dotenv').config();
```

### 2. Login Endpoint Update
**BEFORE:**
```javascript
app.post('/api/students/login', (req, res) => {
  const { phone, password } = req.body;
  const student = database.students.find(s => s.phone === phone);
  if (student && student.password === password) {
    res.json({ success: true, student });
  }
});
```

**AFTER:**
```javascript
app.post('/api/students/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // Find student in MongoDB
    const student = await Student.findOne({ phone });
    
    if (!student || student.passwordHash !== password) {
      logger.logLogin(null, 'student', false);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate OTP (will implement next)
    // For now, generate JWT token
    const token = generateToken({ 
      id: student._id, 
      role: 'student',
      phone: student.phone 
    });
    
    logger.logLogin(student._id, 'student', true);
    res.json({ 
      success: true, 
      token,
      student: { id: student._id, name: student.fullName }
    });
  } catch (error) {
    logger.logError(error, { endpoint: '/api/students/login' });
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Protected Endpoint Example
**BEFORE:**
```javascript
app.post('/api/orders/place', (req, res) => {
  const { studentId, medicines } = req.body;
  const order = { ...newOrder };
  database.orders.push(order);
  res.json({ success: true, orderId: order.orderId });
});
```

**AFTER:**
```javascript
app.post('/api/orders/place', authMiddleware, requireRole('student'), async (req, res) => {
  try {
    const { medicines } = req.body;
    const studentId = req.user.userId; // From JWT token
    
    // Create order in MongoDB
    const order = new Order({
      orderId: generateUUID(),
      studentId,
      medicines,
      status: 'pending',
      urgency: req.body.urgency || 'normal',
      createdAt: new Date()
    });
    
    await order.save();
    
    // Log activity
    logger.logActivity(studentId, 'order-created', { orderId: order.orderId });
    
    res.json({ 
      success: true, 
      orderId: order.orderId,
      message: 'Order created successfully'
    });
  } catch (error) {
    logger.logError(error, { endpoint: '/api/orders/place', studentId: req.user.userId });
    res.status(500).json({ error: error.message });
  }
});
```

---

## 🧪 Testing After Migration

### Test Student Flow
```bash
# 1. Register
curl -X POST http://localhost:3000/api/students/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"0123456789","fullName":"Test Student"}'

# 2. Login (get token)
curl -X POST http://localhost:3000/api/students/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"0123456789","password":"password"}'

# 3. Use token to access protected endpoint
curl -X GET http://localhost:3000/api/students/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Staff Flow
```bash
# 1. Login as nurse
curl -X POST http://localhost:3000/api/staff/login \
  -H "Content-Type: application/json" \
  -d '{"username":"nurse01","password":"password"}'

# 2. View pending orders
curl -X GET http://localhost:3000/api/orders/pending \
  -H "Authorization: Bearer NURSE_TOKEN"
```

### Verify Logs
```bash
# Check error log
tail -f logs/error.log

# Check activity log
tail -f logs/activity.log

# Check all logs
tail -f logs/app.log
```

### Verify Data Persistence
```bash
# 1. Create an order
# 2. Stop server (Ctrl+C)
# 3. Restart server (npm start)
# 4. Query order - should still exist!
```

---

## ⚠️ Breaking Changes

These will change how the client works:

1. **No login without token** - Must send JWT on protected routes
2. **Token format** - Authorization header: `Bearer <token>`
3. **Error responses** - New format with 401/403 status codes
4. **User ID source** - From token, not request body

---

## 🔄 Rollback Plan

If something breaks:
1. ✅ Backup of original data in `backups/` directory
2. ✅ Original database.js still exists
3. ✅ Can revert changes if needed
4. ✅ Database transaction logs for audit

---

## 📊 Migration Checklist

- [ ] .env file created and tested
- [ ] MongoDB Atlas cluster ready
- [ ] Twilio account active
- [ ] server-enhanced.js updated (will do)
- [ ] All endpoints updated with auth
- [ ] Frontend updated to send tokens
- [ ] Test suite passes (will do)
- [ ] Logging works (will do)
- [ ] Data persists after restart (will verify)
- [ ] No errors in log files

---

## 🚀 Ready When You Are!

Once you complete the .env setup and confirm MongoDB/Twilio working:

1. ✅ I'll update server-enhanced.js
2. ✅ I'll migrate data to MongoDB
3. ✅ I'll add authentication to all endpoints
4. ✅ I'll add logging everywhere
5. ✅ I'll test everything
6. ✅ System will be production-ready!

---

**Timeline:** ~2 hours for complete migration + testing  
**Downtime:** ~10 minutes while server is updated  
**Data Loss:** Zero (full backup created)  
**Status:** Waiting for your .env setup ✋

# ✅ KMPP DRONE MEDIC - CORE FEATURES CHECKLIST

**Project Status:** 40% Complete (20/50 features)  
**Start Date:** January 22, 2026  
**Target:** 100% by February 28, 2026  

---

## 🔴 PHASE 1: CRITICAL FOUNDATIONS (This Week!)
**Impact:** System Stability + Security  
**Timeline:** 8-12 hours  
**Status:** 0/4 Complete ❌

### DATABASE PERSISTENCE ⏳
- [ ] **Install MongoDB or PostgreSQL**
  - [ ] Download + install locally OR create MongoDB Atlas account
  - [ ] Test connection string
  - [ ] Choose: MongoDB (easier) vs PostgreSQL (more robust)
- [ ] **Create database.js replacement**
  - [ ] Install Mongoose (if MongoDB): `npm install mongoose`
  - [ ] Install Sequelize (if PostgreSQL): `npm install sequelize pg`
  - [ ] Create connection string in `.env` file
  - [ ] Test: `node -e "require('./db').test()"`
- [ ] **Create Mongoose/Sequelize schemas for:**
  - [ ] Students (name, matric, phone, hostel, room, gpsLocation)
  - [ ] Staff (name, role, username, password, shifts)
  - [ ] Medicines (name, stock, category, emoji, weight, expiry)
  - [ ] Orders (orderId, studentId, medicines, status, timestamp)
  - [ ] Drones (droneId, battery, status, location, payload)
  - [ ] Deliveries (orderId, droneId, status, GPS, ETA)
  - [ ] ActivityLogs (userId, action, timestamp, details)
- [ ] **Migrate existing data**
  - [ ] Export current in-memory data to JSON
  - [ ] Write migration script to load into database
  - [ ] Verify all 20+ students/staff/medicines loaded
- [ ] **Test persistence**
  - [ ] Create order → restart server → verify order still exists
  - [ ] Add medicine → restart server → verify medicine still there
- [ ] **Update all API endpoints**
  - [ ] Replace database.students.push() with database.Student.create()
  - [ ] Replace database.orders.find() with database.Order.findAll()
  - [ ] Test each endpoint works with new database
- **Blockers:** None | **Estimated Time:** 3-4 hours

---

### AUTHENTICATION & AUTHORIZATION ⏳
- [ ] **Install JWT library**
  - [ ] Run: `npm install jsonwebtoken`
  - [ ] Create auth-config.js with JWT secret
- [ ] **Create authentication middleware**
  - [ ] `middleware/auth.js` with `verifyToken()` function
  - [ ] Return 401 if token invalid/missing
  - [ ] Extract userId, role from token
- [ ] **Add JWT generation on login**
  - [ ] `/api/students/login` → generate JWT with studentId + role
  - [ ] `/api/staff/login` → generate JWT with staffId + role
  - [ ] Client stores token in localStorage
  - [ ] Client sends token in Authorization header: `Bearer <token>`
- [ ] **Protect all student routes**
  - [ ] `/api/students/register` → Public (no auth needed)
  - [ ] `/api/students/login` → Public
  - [ ] `/api/students/profile` → Protected (student only)
  - [ ] `/api/orders/place` → Protected (student only)
  - [ ] `/api/orders/my-orders` → Protected (student only)
  - [ ] Test: Try accessing student route without token → 401 error
- [ ] **Protect all staff routes**
  - [ ] `/api/staff/login` → Public
  - [ ] `/api/orders/pending` → Protected (nurse/pharmacist only)
  - [ ] `/api/orders/:orderId/approve` → Protected (nurse only)
  - [ ] `/api/drones/assign` → Protected (operator only)
  - [ ] Test: Try accessing nurse endpoint as student → 401 error
- [ ] **Create role-based access**
  - [ ] Nurse: Can approve/reject orders
  - [ ] Pharmacist: Can verify prescriptions + approve medicine
  - [ ] Operator: Can assign drones + launch
  - [ ] Admin: Can do everything
  - [ ] Student: Can order + view own orders
- [ ] **Update frontend**
  - [ ] Store JWT token after login
  - [ ] Send token in all API requests
  - [ ] Redirect to login if token missing
  - [ ] Handle 401 responses (token expired)
- **Blockers:** None | **Estimated Time:** 3-4 hours

---

### OTP VERIFICATION SYSTEM ⏳
- [ ] **Choose SMS provider (pick one)**
  - [ ] Option A: Twilio: `npm install twilio` + create account
  - [ ] Option B: AWS SNS: `npm install aws-sdk`
  - [ ] Option C: Firebase: `npm install firebase-admin`
  - [ ] Get API keys, add to `.env` file
- [ ] **Create OTP service module**
  - [ ] `services/otp-service.js` with:
    - [ ] `generateOTP()` → creates 6-digit random code
    - [ ] `sendOTP(phone, otp)` → sends via SMS
    - [ ] `storeOTP(userId, otp, expiresIn=5min)` → saves to database
    - [ ] `verifyOTP(userId, otp)` → checks match + deletes
- [ ] **Update student login flow**
  ```
  1. Student enters phone + password
  2. System verifies phone/password match
  3. System generates OTP
  4. System sends OTP to phone (SMS)
  5. UI shows: "Enter 6-digit code sent to your phone"
  6. Student enters OTP
  7. System verifies OTP matches
  8. System generates JWT token
  9. Student logged in successfully
  ```
- [ ] **Update backend endpoints**
  - [ ] `POST /api/students/login` → validates credentials, sends OTP, returns message
  - [ ] `POST /api/students/verify-otp` → validates OTP, returns JWT token
- [ ] **Update frontend UI**
  - [ ] Login page step 1: "Phone & Password" form
  - [ ] Login page step 2: "OTP" input (hidden until needed)
  - [ ] Show countdown timer (5 minutes)
  - [ ] "Resend OTP" button (after 30 seconds)
- [ ] **Test the flow**
  - [ ] Register student with phone 0123456789
  - [ ] Try login: See "OTP sent to phone"
  - [ ] Wrong OTP: Error message
  - [ ] Correct OTP: Logged in
  - [ ] Wait 5+ minutes: OTP expires, need to resend
- [ ] **Optional: Email OTP backup**
  - [ ] If SMS fails, send OTP via email
  - [ ] User can choose SMS or email
- **Blockers:** Need SMS service credentials | **Estimated Time:** 2-3 hours

---

### ERROR LOGGING & MONITORING ⏳
- [ ] **Install logging library**
  - [ ] Option A (Recommended): `npm install winston`
  - [ ] Option B: `npm install bunyan`
  - [ ] Create `services/logger.js`
- [ ] **Configure logging levels**
  - [ ] ERROR: System errors, failures
  - [ ] WARN: Warnings, unusual situations
  - [ ] INFO: Important events (login, order, etc.)
  - [ ] DEBUG: Detailed debugging info
- [ ] **Create log files**
  - [ ] `/logs/error.log` - All errors with stack traces
  - [ ] `/logs/activity.log` - All user activities
  - [ ] `/logs/app.log` - All application events
  - [ ] Daily rotation (create new file each day)
- [ ] **Log all activities**
  - [ ] User login/logout
  - [ ] Order created/approved/rejected
  - [ ] Drone assigned/launched/returned
  - [ ] Prescription uploaded
  - [ ] Medicine prepared
  - [ ] Any errors with full stack trace
- [ ] **Create logging calls in all APIs**
  - [ ] At start: `logger.info('POST /api/students/register', {phone})`
  - [ ] On success: `logger.info('Student registered successfully', {studentId})`
  - [ ] On error: `logger.error('Registration failed', {error, stack})`
  - [ ] Pattern: Every API call logged
- [ ] **Create error handler middleware**
  - [ ] Catch all errors globally
  - [ ] Log error + stack trace
  - [ ] Return error message to client
  - [ ] Never crash the server
- [ ] **Create admin endpoint**
  - [ ] `GET /api/admin/logs?limit=100&level=ERROR`
  - [ ] Returns last 100 errors
  - [ ] Allows filtering by level, date, etc.
- [ ] **Create monitoring dashboard (simple)**
  - [ ] Show last 50 log entries
  - [ ] Color code by severity
  - [ ] Auto-refresh every 10 seconds
- [ ] **Test logging**
  - [ ] Create an order → check logs show it
  - [ ] Cause an error → check error logged with stack
  - [ ] Restart server → logs still exist
- **Blockers:** None | **Estimated Time:** 2-3 hours

---

## 🟢 PHASE 2: CORE BUSINESS FEATURES
**Impact:** Functional Medicine Delivery  
**Timeline:** 14-18 hours  
**Status:** 0/5 Complete ❌

### PRESCRIPTION UPLOAD & VALIDATION ⏳
- [ ] **Create upload form**
  - [ ] Add file input in new page or login.html
  - [ ] Allow image (JPG/PNG) or PDF upload
  - [ ] Max file size: 5MB
  - [ ] Optional: Medicine name field
- [ ] **Backend upload endpoint**
  - [ ] `POST /api/prescriptions/upload`
  - [ ] Accept multipart/form-data
  - [ ] Save file to `/uploads/prescriptions/` folder
  - [ ] Name file: `prescription_${prescriptionId}_${timestamp}.jpg`
  - [ ] Save metadata to database: prescriptionId, studentId, filename, status, uploadDate
  - [ ] Return: prescriptionId, status, message
- [ ] **Pharmacist verification flow**
  - [ ] Add "Pending Prescriptions" tab in staff dashboard
  - [ ] Show: Student name, phone, prescription image
  - [ ] Show: Medicines requested (text)
  - [ ] Pharmacist can: **APPROVE** or **REJECT** with reason
  - [ ] Update prescription status in database
  - [ ] Send notification to student
- [ ] **Link prescription to orders**
  - [ ] When student places order:
    - [ ] If medicine is "restricted" (antibiotics, controlled): Need approved prescription
    - [ ] If medicine is "normal" (paracetamol, cough syrup): Optional prescription
  - [ ] Check: `prescription.status === "approved"`
  - [ ] If not approved: Reject order with message
- [ ] **Restricted medicines list**
  - [ ] Create list in database: `restrictedMedicines`
  - [ ] Add field to medicines table: `requiresPrescription: true/false`
  - [ ] Update all 12 medicines with this flag
  - [ ] Default: `requiresPrescription: false` (most are over-the-counter)
- [ ] **Test the flow**
  - [ ] Student uploads prescription
  - [ ] Pharmacist sees it in pending list
  - [ ] Pharmacist approves it
  - [ ] Student can now order restricted medicine
  - [ ] If rejected: Student sees rejection reason
- **Blockers:** File upload handling | **Estimated Time:** 4-5 hours

---

### MEDICINE PREPARATION WORKFLOW ⏳
- [ ] **Update order status flow**
  ```
  OLD: pending → approved → dispatched → in-transit → delivered
  NEW: pending → approved → PREPARING → dispatched → in-transit → delivered
  ```
- [ ] **Create "preparing" status**
  - [ ] Add to database: `order.status = "preparing"`
  - [ ] Add to frontend: Show "Pharmacist preparing medicine" message
- [ ] **Pharmacist UI (in staff dashboard)**
  - [ ] New tab: "Medicine to Prepare"
  - [ ] Show: All orders with `status === "approved"`
  - [ ] Show: Medicine list, quantity, special notes
  - [ ] Pharmacist picks items, packs box
  - [ ] Clicks: "Medicine Packed" button
  - [ ] System updates: `order.status = "preparing"`
  - [ ] Sends notification to operator: "Your order is ready!"
- [ ] **Operator UI (in staff dashboard)**
  - [ ] New tab: "Ready for Dispatch"
  - [ ] Show: All orders with `status === "preparing"`
  - [ ] Show: Medicine list, destination (student room)
  - [ ] Operator picks up box from pharmacist
  - [ ] Clicks: "Load Drone" button
  - [ ] System updates: `order.status = "ready-for-dispatch"` (new status)
  - [ ] System shows: "Assign drone" dialog
- [ ] **Add timestamps to workflow**
  - [ ] `order.approvedAt` - When nurse approved
  - [ ] `order.preparedAt` - When pharmacist packed
  - [ ] `order.loadedAt` - When operator loaded drone
  - [ ] `order.dispatchedAt` - When drone launched
  - [ ] `order.deliveredAt` - When student received
- [ ] **Add notes field**
  - [ ] Pharmacist can add: "No exact change, gave alternative"
  - [ ] Operator can add: "Drone #3 assigned, ETA 15 min"
  - [ ] Visible in order history
- [ ] **Test the workflow**
  - [ ] Create order → approved
  - [ ] Pharmacist marks "packed" → status = "preparing"
  - [ ] Operator marks "loaded" → status = "ready-for-dispatch"
  - [ ] Operator assigns drone → status = "dispatched"
- **Blockers:** None | **Estimated Time:** 3-4 hours

---

### URGENCY-BASED LOGIC ⏳
- [ ] **Add urgency selector on checkout**
  - [ ] Radio buttons: Normal / Urgent / Emergency
  - [ ] Default: Normal
  - [ ] Show: "Standard delivery", "30 min", "10 min" labels
- [ ] **Update order model**
  - [ ] Add field: `order.urgency` = "normal" / "urgent" / "emergency"
- [ ] **Create urgency workflow**
  
  | Level | Processing Time | Approvals | Skip | Priority |
  |-------|-----------------|-----------|------|----------|
  | Normal | 1-2 hours | Full review | None | Low |
  | Urgent | 30 minutes | Nurse only | Pharmacist optional | Medium |
  | Emergency | 10 minutes | Operator only | All checks | High |

- [ ] **Normal order flow (existing)**
  - [ ] Pending → Approved by nurse → Prepared → Dispatched
- [ ] **Urgent order flow**
  - [ ] Pending → **Auto-approved** → Pharmacist reviews → Prepared → Dispatched
  - [ ] Skips some delays
  - [ ] Nurse still reviews (within 30 min)
- [ ] **Emergency order flow**
  - [ ] Pending → **Auto-approved** → **Auto-prepared** → **Auto-dispatched**
  - [ ] Operator can refuse if impossible
  - [ ] No delays
  - [ ] All staff notified immediately
- [ ] **Update dashboard**
  - [ ] Show urgency badge on each order: 🟢 Normal / 🟠 Urgent / 🔴 Emergency
  - [ ] Sort by urgency (Emergency first, then Urgent, then Normal)
  - [ ] Count badges: "2 Emergency, 5 Urgent, 12 Normal orders"
- [ ] **Create escalation notifications**
  - [ ] Emergency orders notify: ALL staff
  - [ ] Urgent orders notify: Nurse + Operator
  - [ ] Normal orders notify: Assigned staff
- [ ] **Add audit log for urgency**
  - [ ] If order rejected as "urgent": Log reason
  - [ ] Can't reject without staff approval/reason
- [ ] **Test the flows**
  - [ ] Normal order: Takes full workflow
  - [ ] Urgent order: Skips some approvals
  - [ ] Emergency order: Goes straight to dispatch
- **Blockers:** None | **Estimated Time:** 2-3 hours

---

### IN-APP NOTIFICATIONS UI ⏳
- [ ] **Update HTML layout**
  - [ ] Add notification bell icon in header (🔔)
  - [ ] Add notification dropdown/panel
  - [ ] Show: Latest 10 notifications
  - [ ] Show: "See all" link
- [ ] **Create notification card HTML**
  ```html
  <div class="notification-card">
    <div class="notification-icon">✅</div>
    <div class="notification-content">
      <p class="notification-title">Order Approved!</p>
      <p class="notification-message">Your order #12345 has been approved</p>
      <p class="notification-time">5 minutes ago</p>
    </div>
    <button class="notification-close">×</button>
  </div>
  ```
- [ ] **Create notification types**
  - [ ] 🟢 Order approved
  - [ ] 🟡 Order pending approval
  - [ ] 🟠 Drone dispatched
  - [ ] 📍 Delivery in transit (ETA: 15 min)
  - [ ] ✅ Delivery arrived
  - [ ] 🎉 Delivery complete
  - [ ] ❌ Order rejected (with reason)
  - [ ] ⚠️ System alert
- [ ] **Update JavaScript to handle notifications**
  - [ ] Listen for WebSocket events:
    ```javascript
    socket.on('order-status-changed', (data) => {
      showNotification(data.type, data.message);
    });
    ```
  - [ ] Listen for: "order-approved", "drone-launched", "delivery-arrived", "order-rejected"
  - [ ] Display in UI immediately
  - [ ] Save to localStorage (notification history)
  - [ ] Badge on notification icon (count of unread)
- [ ] **Add notification settings**
  - [ ] Student profile page: Toggle notifications on/off
  - [ ] Options: All / Important only / None
  - [ ] Sound toggle: On / Off
  - [ ] Show only in-app vs also show browser notifications
- [ ] **Create notification history**
  - [ ] "View all notifications" page
  - [ ] Show: All notifications, sorted by date
  - [ ] Filter: By type, date, read/unread
  - [ ] Mark as read/unread
- [ ] **Update backend APIs**
  - [ ] When order status changes → emit WebSocket event
  - [ ] When drone launches → emit event
  - [ ] All existing status changes trigger notifications
- [ ] **Test notifications**
  - [ ] Approve order → See notification in UI
  - [ ] Dispatch drone → See notification with ETA
  - [ ] Receive delivery → Notification with completion message
- **Blockers:** Socket.io already working | **Estimated Time:** 3-4 hours

---

### SMS/EMAIL NOTIFICATIONS ⏳
- [ ] **Install notification libraries**
  - [ ] SMS: `npm install twilio` (if not already)
  - [ ] Email: `npm install nodemailer` or `npm install @sendgrid/mail`
- [ ] **Create notification service module**
  - [ ] `services/notification-service.js` with:
    ```javascript
    async function sendSMS(phone, message) { ... }
    async function sendEmail(email, subject, body) { ... }
    async function sendBoth(phone, email, message, subject) { ... }
    ```
- [ ] **Get API credentials**
  - [ ] SMS: Twilio account (create at twilio.com)
  - [ ] Email: Gmail app password OR SendGrid key
  - [ ] Add to `.env` file
- [ ] **Update status change handlers**
  - [ ] When `order.status = "approved"`:
    ```
    - Send SMS: "✅ Order #123 APPROVED! Pharmacist preparing. ETA 1 hour."
    - Send Email: With order details
    ```
  - [ ] When `order.status = "dispatched"`:
    ```
    - Send SMS: "🛸 Drone launched! Arriving in 25 minutes to Hostel 2, Room 305"
    - Send Email: With tracking link + drone ID
    ```
  - [ ] When `order.status = "delivered"`:
    ```
    - Send SMS: "✅ DELIVERED! Please rate your experience: [link]"
    - Send Email: With feedback form + receipt
    ```
  - [ ] When `order.status = "rejected"`:
    ```
    - Send SMS: "❌ Order rejected. Reason: Medicine out of stock. Contact pharmacist."
    - Send Email: With details + alternative options
    ```
- [ ] **Add student communication preferences**
  - [ ] Database field: `student.notificationPreferences`
    - [ ] SMS: yes/no
    - [ ] Email: yes/no
    - [ ] Phone: Different number?
    - [ ] Email: Different address?
- [ ] **Create opt-in flow**
  - [ ] During registration: Ask "Send you SMS updates?"
  - [ ] Profile page: Manage notification preferences
  - [ ] Each notification: Option to unsubscribe
- [ ] **Add notification queue (for reliability)**
  - [ ] If SMS send fails: Retry 3 times
  - [ ] If still fails: Log error, notify admin
  - [ ] If email send fails: Queue for later retry
- [ ] **Test the flows**
  - [ ] Approve order → SMS sent within 5 seconds
  - [ ] Dispatch drone → SMS with ETA sent
  - [ ] Student receives both SMS and email
  - [ ] If SMS fails: Fall back to email
- **Blockers:** API credentials | **Estimated Time:** 2-3 hours

---

## 🟡 PHASE 3: SAFETY & OPERATIONAL FEATURES
**Impact:** Safe & Efficient Operations  
**Timeline:** 15-20 hours  
**Status:** 0/5 Complete ❌

### GEO-FENCING & NO-FLY ZONES ⏳
- [ ] **Define KMPP campus boundaries**
  - [ ] Get coordinates for KMPP campus center
  - [ ] Typical Malaysia coordinates: ±5-10 degrees latitude/longitude
  - [ ] Create circular boundary: center point + radius (2-3 km)
  - [ ] Add to database:
    ```javascript
    campus: {
      center: { lat: 5.2767, lng: 100.3175 },
      radius: 3000 // meters
    }
    ```
- [ ] **Define no-fly zones (restricted areas)**
  - [ ] Map out: Buildings, hospitals, sensitive areas
  - [ ] Define as polygons: `[{lat, lng}, {lat, lng}, ...]`
  - [ ] Add to database:
    ```javascript
    noFlyZones: [
      { name: "Main Hospital", polygon: [...], radius: 500 },
      { name: "Admin Building", polygon: [...], radius: 300 },
      { name: "Water Tower", polygon: [...], radius: 200 }
    ]
    ```
- [ ] **Update Leaflet.js map display**
  - [ ] Draw green circle (campus boundary)
  - [ ] Draw red zones (no-fly zones)
  - [ ] Update existing map code
  - [ ] Show on both admin dashboard and live tracking
- [ ] **Create geo-fence validation logic**
  ```javascript
  function isInCampus(lat, lng) {
    distance = calculateDistance(lat, lng, campus.center);
    return distance <= campus.radius;
  }
  
  function isInNoFlyZone(lat, lng) {
    for (zone in noFlyZones) {
      if (pointInPolygon(lat, lng, zone.polygon)) return true;
    }
    return false;
  }
  ```
- [ ] **Add validation to drone operations**
  - [ ] Before accepting delivery order: Check destination in campus
  - [ ] If outside campus: Reject order with message
  - [ ] If in no-fly zone: Reject order with message
  - [ ] Only allow orders to valid areas
- [ ] **Real-time boundary checking**
  - [ ] While drone flying: Check every GPS update
  - [ ] If crosses boundary: Trigger return-to-base (see emergency stop)
  - [ ] Log boundary violation event
- [ ] **Create admin zone editor**
  - [ ] Map drawing tool (draw polygons)
  - [ ] Click to add points, complete polygon
  - [ ] Save new zones to database
  - [ ] Edit existing zones
  - [ ] Delete zones (with confirmation)
  - [ ] Test boundary visually on map
- [ ] **Test geo-fencing**
  - [ ] Try ordering delivery outside campus → Rejected
  - [ ] Try ordering in no-fly zone → Rejected
  - [ ] Ordering inside campus & safe areas → Accepted
  - [ ] Simulate drone crossing boundary → Return triggered
- **Blockers:** None | **Estimated Time:** 4-5 hours

---

### EMERGENCY STOP & RETURN-TO-BASE ⏳
- [ ] **Create emergency stop endpoint**
  - [ ] `POST /api/drones/:droneId/emergency-stop`
  - [ ] Only operators/admins can trigger (check auth)
  - [ ] Required: Reason (safety incident, mechanical issue, etc.)
  - [ ] Action:
    - [ ] Stop drone movement immediately
    - [ ] Hold position (hover in place)
    - [ ] Log incident with timestamp + location
    - [ ] Notify all staff
    - [ ] Update drone status to "emergency-stopped"
- [ ] **Create return-to-base endpoint**
  - [ ] `POST /api/drones/:droneId/return-to-base`
  - [ ] Only operators/admins can trigger
  - [ ] Action:
    - [ ] Calculate path back to clinic/base
    - [ ] Initiate auto-navigation to base
    - [ ] Drone follows path automatically
    - [ ] When reaches base: Drone lands safely
    - [ ] Log return event: timestamp, location, reason
    - [ ] Update drone status to "grounded"
- [ ] **Add UI buttons in operator dashboard**
  - [ ] Show: Current active drones with status
  - [ ] Each drone row has: **EMERGENCY STOP** button (red, large)
  - [ ] Each drone row has: **RETURN TO BASE** button (orange)
  - [ ] Buttons only visible when drone is flying
  - [ ] Click → Show confirmation dialog: "Are you sure? This will [action]"
  - [ ] Require reason input before confirmation
- [ ] **Add incident logging**
  - [ ] When stop/RTB triggered:
    - [ ] Create incident record: `{droneId, action, reason, timestamp, location, staffId}`
    - [ ] Save to database: `incidents` table
    - [ ] Update delivery status (if any): "aborted"
    - [ ] Notify student: "Your delivery has been cancelled due to [reason]"
- [ ] **Create incident dashboard**
  - [ ] Admin page: "Recent Incidents"
  - [ ] Show: All emergency stops + RTB events
  - [ ] Show: Reason, drone, staff member, time, location
  - [ ] Filter: By date, drone, staff
  - [ ] Analytics: "5 emergency stops this month" etc.
- [ ] **Test emergency scenarios**
  - [ ] Operator clicks emergency stop → Drone status changes to "stopped"
  - [ ] Operator clicks return-to-base → Drone navigates back
  - [ ] Incident logged and visible in admin dashboard
  - [ ] Student gets notification about cancellation
- [ ] **Add battery failsafe**
  - [ ] If drone battery < 20% → Auto-return-to-base
  - [ ] Log as automatic action, not manual emergency
- **Blockers:** None | **Estimated Time:** 3-4 hours

---

### PAYLOAD WEIGHT VALIDATION ⏳
- [ ] **Add weight data to medicines**
  - [ ] Update all 12 medicines with weight (in grams)
  - [ ] Typical weights: 50g (small pill), 200g (large bottle)
  - [ ] Add to database: `medicine.weight`
  - [ ] Example:
    ```javascript
    {name: "Paracetamol", weight: 50, ...}
    {name: "Cough Syrup", weight: 180, ...}
    ```
- [ ] **Update drone specifications**
  - [ ] Each drone has max payload capacity
  - [ ] Add to database: `drone.maxPayload` (in grams)
  - [ ] Example: Drone #1: 2000g, Drone #2: 3000g
- [ ] **Create weight validation function**
  ```javascript
  function validatePayload(medicines, droneId) {
    totalWeight = sum(medicines.map(m => m.weight * m.quantity));
    drone = getDrone(droneId);
    if (totalWeight > drone.maxPayload) {
      return { valid: false, reason: "Too heavy" };
    }
    return { valid: true };
  }
  ```
- [ ] **Add validation to order assignment**
  - [ ] When assigning drone to order: Check weight
  - [ ] Show: "Total weight: 450g, Drone capacity: 2000g (22% used)"
  - [ ] Show: **Only allow drones with enough capacity**
  - [ ] If all drones too small: Show error "No drones available for this order"
- [ ] **Update order checkout**
  - [ ] Calculate total weight of medicines
  - [ ] Show: "Total weight: 450g" (for reference)
  - [ ] Show: "Required drone capacity: 1000g+" (with 50% buffer)
- [ ] **Create weight report**
  - [ ] Admin dashboard: "Payload Statistics"
  - [ ] Show: Average payload per drone
  - [ ] Show: % of capacity used (efficiency metric)
  - [ ] Alert if >80% capacity (risky)
  - [ ] Alert if <10% (inefficient)
- [ ] **Test payload validation**
  - [ ] Order light medicines → Any drone can carry
  - [ ] Order heavy medicines → Only large drones available
  - [ ] Order exceeds any drone capacity → Error message
  - [ ] See payload % on assignment screen
- **Blockers:** None | **Estimated Time:** 2-3 hours

---

### ROUTE PLANNING & ETA CALCULATION ⏳
- [ ] **Choose routing service (pick one)**
  - [ ] Option A: OSRM (Open Source, free, self-hosted)
  - [ ] Option B: Google Maps API (paid, ~$0.005 per request)
  - [ ] Option C: Mapbox (paid, ~$0.50 per 1000 requests)
  - [ ] Recommend: OSRM (free) or Google Maps (reliable)
- [ ] **For Google Maps API:**
  - [ ] Create API key at Google Cloud Console
  - [ ] Enable Maps API + Distance Matrix API
  - [ ] Add to `.env`: `GOOGLE_MAPS_API_KEY=...`
  - [ ] Install: `npm install @googlemaps/js-client`
- [ ] **For OSRM:**
  - [ ] Install: `npm install osrm`
  - [ ] Download OSRM data for Malaysia (or use online service)
  - [ ] Setup local OSRM server
- [ ] **Create route calculation function**
  ```javascript
  async function calculateRoute(startLat, startLng, endLat, endLng) {
    // Using Google Maps API
    const response = await mapsClient.distanceMatrix({
      origins: [{ lat: startLat, lng: startLng }],
      destinations: [{ lat: endLat, lng: endLng }]
    });
    
    distance = response.rows[0].elements[0].distance.value; // in meters
    duration = response.rows[0].elements[0].duration.value; // in seconds
    
    return {
      distance: distance / 1000, // in km
      duration: Math.ceil(duration / 60), // in minutes
      speed: 40 // km/h (drone speed)
    };
  }
  ```
- [ ] **Get route points for mapping**
  - [ ] Use polyline decoding to get path points
  - [ ] Draw line on map: start → destination
  - [ ] Show: Distance, time, altitude changes
- [ ] **Update order assignment workflow**
  - [ ] When drone assigned to order:
    - [ ] Get start location (clinic)
    - [ ] Get destination (student room GPS)
    - [ ] Call `calculateRoute()`
    - [ ] Get: distance (5.2 km), duration (8 minutes)
    - [ ] Calculate ETA: `now + 8 minutes = 2:35 PM`
- [ ] **Add weather adjustment**
  - [ ] Check wind speed at destination
  - [ ] If windy: Add 20% to ETA
  - [ ] If heavy rain: Recommend postponing
  - [ ] Show: "Normal ETA: 8 min, With weather: 10 min"
- [ ] **Update frontend display**
  - [ ] Show on order details: "Distance: 5.2 km, ETA: 8 minutes"
  - [ ] Show on live tracking: Remaining distance, remaining time
  - [ ] Update ETA every minute as drone moves
- [ ] **Create efficiency metrics**
  - [ ] Track actual vs estimated time
  - [ ] Calculate on-time percentage
  - [ ] Identify slow routes (traffic, long distances)
- [ ] **Test route planning**
  - [ ] Assign drone to order → See calculated route
  - [ ] Route shows on map
  - [ ] ETA displayed to student
  - [ ] ETA updates as drone progresses
  - [ ] Compare actual vs estimated time
- **Blockers:** Google Maps API key or OSRM setup | **Estimated Time:** 4-5 hours

---

### STOCK TRANSACTION LOGGING ⏳
- [ ] **Create transaction schema**
  - [ ] Fields: `{medicineId, quantity, type, timestamp, staffId, reason, notes}`
  - [ ] Types: "out" (used), "in" (restocked), "adjustment" (correction), "expired" (removed)
  - [ ] Add to database: `transactions` table
- [ ] **Update medicine movements**
  - [ ] When order created: Log "out" transaction
    ```javascript
    for (medicine in order.medicines) {
      logTransaction({
        medicineId: medicine.id,
        quantity: -medicine.quantity,
        type: "out",
        reason: "Order " + order.id,
        staffId: currentUser.id
      });
    }
    ```
  - [ ] When stock refilled: Log "in" transaction
    ```javascript
    logTransaction({
      medicineId: medicineId,
      quantity: 50,
      type: "in",
      reason: "Restock from supplier",
      staffId: pharmacistId
    });
    ```
  - [ ] When adjusted: Log "adjustment"
    ```javascript
    logTransaction({
      medicineId: medicineId,
      quantity: -5,
      type: "adjustment",
      reason: "Damaged items removed",
      staffId: pharmacistId,
      notes: "5 bottles broken during transport"
    });
    ```
  - [ ] When expired: Log "expired"
    ```javascript
    logTransaction({
      medicineId: medicineId,
      quantity: -20,
      type: "expired",
      reason: "Expiry date reached",
      staffId: pharmacistId
    });
    ```
- [ ] **Create transaction history API**
  - [ ] `GET /api/medicines/:medicineId/transactions`
  - [ ] Returns: All transactions for that medicine
  - [ ] Sortable: By date, type, quantity
  - [ ] Filterable: By date range, transaction type
  - [ ] Example response:
    ```json
    [
      {id: 1, type: "in", quantity: 50, date: "2026-01-20", staffId: 5, reason: "Restock"},
      {id: 2, type: "out", quantity: -3, date: "2026-01-21", staffId: 12, reason: "Order #234"},
      {id: 3, type: "out", quantity: -1, date: "2026-01-21", staffId: 12, reason: "Order #235"}
    ]
    ```
- [ ] **Create stock report**
  - [ ] `GET /api/admin/stock-report`
  - [ ] Shows: All medicines with current stock + movement history
  - [ ] Columns: Medicine, Stock, Used (this week), Restocked, Expired, Adjusted
  - [ ] Export as CSV for records
- [ ] **Create audit trail**
  - [ ] Every stock change linked to staff member
  - [ ] Every change has timestamp
  - [ ] Adjustments require reason/notes
  - [ ] Historical tracking: Can see entire stock history
- [ ] **Add stock predictions**
  - [ ] Calculate: Average usage per day
  - [ ] Alert: "Paracetamol will run out in 3 days at current rate"
  - [ ] Pharmacist can auto-generate restock orders
- [ ] **Test transaction logging**
  - [ ] Create order → Check transaction log shows "out"
  - [ ] Refill medicine → Check transaction log shows "in"
  - [ ] Run stock report → See total changes
  - [ ] View transaction history for one medicine
- **Blockers:** None | **Estimated Time:** 2-3 hours

---

## 🟢 PHASE 4: NICE-TO-HAVE FEATURES (Polish)
**Status:** 0/6 Complete ❌

### MAINTENANCE SCHEDULING & TRACKING
- [ ] Create maintenance schema
- [ ] Admin can schedule drone maintenance
- [ ] Drone unavailable during maintenance
- [ ] Track maintenance history per drone
- [ ] **Estimated Time:** 3-4 hours

---

### CHARGING STATION MANAGEMENT
- [ ] Define charging stations on campus
- [ ] Track which drones charging, ETA to full
- [ ] Auto-stop orders if no drones available
- [ ] **Estimated Time:** 2-3 hours

---

### INCIDENT REPORT SYSTEM
- [ ] Create incident form (delivery issues, safety, etc.)
- [ ] Track incidents: open → investigating → resolved
- [ ] Assign to staff, add notes/updates
- [ ] **Estimated Time:** 4-5 hours

---

### ADVANCED ADMIN DASHBOARD
- [ ] System health: Server status, uptime, errors
- [ ] Analytics: Orders per day, success rate, popular medicines
- [ ] User management: Add/edit/delete staff, manage roles
- [ ] **Estimated Time:** 6-8 hours

---

### WEATHER INTEGRATION
- [ ] Integrate weather API (OpenWeatherMap)
- [ ] Check conditions before approving flights
- [ ] Adjust ETA based on wind
- [ ] **Estimated Time:** 2-3 hours

---

### OFFLINE MODE & SERVICE WORKER
- [ ] Create service worker for caching
- [ ] Queue orders while offline
- [ ] Sync when reconnected
- [ ] **Estimated Time:** 6-8 hours

---

## 📊 COMPLETION TRACKER

| Phase | Category | Status | Progress |
|-------|----------|--------|----------|
| **1** | Database | ⬜⬜⬜⬜⬜ | 0% |
| **1** | Auth | ⬜⬜⬜⬜⬜ | 0% |
| **1** | OTP | ⬜⬜⬜⬜⬜ | 0% |
| **1** | Logging | ⬜⬜⬜⬜⬜ | 0% |
| **2** | Prescriptions | ⬜⬜⬜⬜⬜ | 0% |
| **2** | Med Prep | ⬜⬜⬜⬜⬜ | 0% |
| **2** | Urgency | ⬜⬜⬜⬜⬜ | 0% |
| **2** | Notifications | ⬜⬜⬜⬜⬜ | 0% |
| **2** | SMS/Email | ⬜⬜⬜⬜⬜ | 0% |
| **3** | Geo-fence | ⬜⬜⬜⬜⬜ | 0% |
| **3** | Emerg Stop | ⬜⬜⬜⬜⬜ | 0% |
| **3** | Payload | ⬜⬜⬜⬜⬜ | 0% |
| **3** | Route | ⬜⬜⬜⬜⬜ | 0% |
| **3** | Stock Log | ⬜⬜⬜⬜⬜ | 0% |
| **4** | Maintenance | ⬜⬜⬜⬜⬜ | 0% |
| **4** | Charging | ⬜⬜⬜⬜⬜ | 0% |
| **4** | Incidents | ⬜⬜⬜⬜⬜ | 0% |
| **4** | Admin Dashboard | ⬜⬜⬜⬜⬜ | 0% |
| **4** | Weather | ⬜⬜⬜⬜⬜ | 0% |
| **4** | Offline | ⬜⬜⬜⬜⬜ | 0% |

**Overall:** 0/20 features (0%) ❌

---

## ⏱️ TIME ESTIMATES

| Phase | Hours | Days (8h/day) | Weeks |
|-------|-------|---------------|-------|
| Phase 1 (Critical) | 8-12 | 1-2 | 1 week |
| Phase 2 (Core) | 14-18 | 2-3 | 1-2 weeks |
| Phase 3 (Safety) | 15-20 | 2-3 | 1-2 weeks |
| Phase 4 (Polish) | 20-28 | 3-4 | 2-3 weeks |
| **TOTAL** | **57-78 hours** | **8-12** | **4-8 weeks** |

**Recommended Pace:** 12-15 hours per week = **Complete in 4-5 weeks**

---

## 🎯 NEXT STEPS

**Choose ONE of these:**

### Option A: Start Phase 1 Now (Recommended)
- Build solid foundation
- System becomes production-ready
- Takes 1 week
- **Do this if you want:** A robust, secure system

### Option B: Quick Wins First
- Focus on user-visible features
- Add notifications + prescriptions first
- Takes 2-3 days
- **Do this if you want:** Impressive demo quickly

### Option C: Safety First
- Focus on geo-fencing + emergency controls
- Ensure safe operations
- Takes 1 week
- **Do this if you want:** Campus approval + safe operations

### Option D: Balanced Approach
- Do Phase 1 (3-4 days) + Part of Phase 2
- Get secure foundation + some features
- Takes 1.5-2 weeks
- **Do this if you want:** Best of both worlds

---

## 📋 DECISION REQUIRED

Before proceeding, answer these questions:

1. **Database Choice:**
   - MongoDB (easier, flexible) or PostgreSQL (robust, traditional)?
   
2. **SMS Provider:**
   - Twilio (reliable, has trial) or AWS SNS (if using AWS)?
   
3. **Timeline:**
   - 1 week? 2 weeks? 1 month?
   
4. **Phase Order:**
   - Start with Phase 1? Or different order?

5. **Assistance Level:**
   - Full implementation? Code review only? Guidance only?

---

**Created:** January 22, 2026  
**Last Updated:** January 22, 2026  
**Status:** Ready for implementation

# 🚀 SkyMatrix - Quick Setup Guide

## Installation Steps

### 1. Navigate to Project Directory
```powershell
cd "C:\Users\ASUS\Documents\PROGRAMMING\DRONE"
```

### 2. Install Node.js Packages
```powershell
npm install
```

This will install:
- express (web framework)
- cors (cross-origin requests)
- socket.io (real-time updates)
- uuid (unique ID generation)
- dotenv (environment variables)

### 3. Start the Server
```powershell
npm start
```

You should see:
```
============================================================
🛩️  SkyMatrix - Student Medicine Delivery System
============================================================
📡 Environment: development
🌐 Server: http://localhost:3000
🔗 API: http://localhost:3000/api
📊 WebSocket: ws://localhost:3000
============================================================
✅ Server is running! Open browser at http://localhost:3000
============================================================
```

### 4. Open in Browser
Open your browser and go to:
```
http://localhost:3000/dashboard.html
```

## 📁 File Structure

```
DRONE/
├── dashboard.html          ← Main UI (open this in browser)
├── dashboard.js            ← Frontend logic
├── server-enhanced.js      ← Backend server
├── database.js             ← Data models
├── package.json            ← Dependencies
├── README.md               ← Full documentation
├── SETUP.md                ← This file
├── index.html              ← (Old) Original web version
├── main.dart               ← Flutter mobile app
├── pubspec.yaml            ← Flutter config
└── styles.css              ← (Old) Original styles
```

## 🎯 Getting Started

### For Students:
1. Click "Register" tab
2. Fill in your details (Full Name, Student ID, Email, Phone, Hostel Address)
3. Click "Order Medicine" tab
4. Select a medicine and quantity
5. Choose urgency level
6. Click "Place Order"
7. Use "Track Order" to monitor delivery

### For Clinic Staff:
1. Click "Staff Portal" tab
2. Login with:
   - Username: `dr.sarah`
   - Password: `password123`
3. View pending orders
4. Click "Approve" to verify prescription

### For Monitoring:
- Dashboard shows real-time drone fleet status
- View medicine inventory in "Clinic Info"
- Check analytics for delivery statistics

## 📱 Available Test Data

### Medicines (12 items):
- Paracetamol, Ibuprofen, Aspirin (Pain Relief)
- Cough Syrup, Allergy Relief, Diphenhydramine (Cold & Cough)
- Vitamin C (Vitamins)
- Amoxicillin (Antibiotics)
- Metformin (Diabetes)
- Lisinopril (Blood Pressure)
- Atorvastatin (Cholesterol)
- Omeprazole (Stomach)

### Drones (3 units):
- DRONE001: Available, 95% battery
- DRONE002: Available, 78% battery
- DRONE003: Charging, 45% battery

## 🔧 Troubleshooting

### Port 3000 is already in use?
Change the port:
```powershell
$env:PORT=3001; npm start
```

### Can't connect to localhost?
- Make sure server is running
- Check firewall settings
- Try `http://127.0.0.1:3000` instead

### No medicines showing?
- Refresh the page (F5)
- Check browser console (F12) for errors
- Make sure server is running

### Order not saving?
- Data is stored in memory (resets when server restarts)
- Add database (MongoDB/PostgreSQL) for persistence

## 📊 API Examples

### Place Order
```bash
POST http://localhost:3000/api/orders/place
Content-Type: application/json

{
  "studentId": "A123456",
  "medicines": [
    {
      "medicineId": "MED001",
      "name": "Paracetamol 500mg",
      "quantity": 2,
      "price": 2.50
    }
  ],
  "deliveryLocation": "Hostel A, Block 2",
  "urgency": "normal",
  "notes": "For headache"
}
```

### Approve Order (Staff)
```bash
PATCH http://localhost:3000/api/orders/SKY-ABC12345/approve
Content-Type: application/json

{
  "staffId": "STAFF001"
}
```

### Get Order Status
```bash
GET http://localhost:3000/api/orders/SKY-ABC12345
```

### Get Drone Fleet
```bash
GET http://localhost:3000/api/drones
```

## 💾 Database Persistence

Currently using in-memory storage. To add real database:

### Option 1: MongoDB
```powershell
npm install mongoose
```

### Option 2: PostgreSQL
```powershell
npm install pg sequelize
```

### Option 3: SQLite
```powershell
npm install sqlite3
```

## 🔐 Security Features

- ✅ CORS enabled for cross-origin requests
- ✅ JSON body parser with size limits
- ✅ Staff login authentication
- ✅ Order prescription verification
- ✅ Delivery confirmation tracking
- ⏳ TODO: JWT tokens
- ⏳ TODO: Password hashing (bcrypt)
- ⏳ TODO: Rate limiting
- ⏳ TODO: Input validation (Joi)

## 📈 Performance Tips

- Use database instead of in-memory for production
- Add caching (Redis) for frequent queries
- Implement pagination for large datasets
- Compress API responses
- Use CDN for static files
- Enable gzip compression

## 🐛 Debugging

### Enable detailed logs:
```powershell
$env:DEBUG='*'; npm start
```

### Check what's happening:
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Perform an action
4. See API calls and responses

## 📞 Need Help?

Check these files:
- `README.md` - Full documentation
- `server-enhanced.js` - Backend logic
- `database.js` - Data models
- `dashboard.js` - Frontend logic

## 🎉 You're All Set!

Your SkyMatrix system is ready to use. Start the server and open the dashboard to begin managing medicine deliveries!

```powershell
npm start
```

Then visit: `http://localhost:3000/dashboard.html`

---

**Need to stop the server?** Press `Ctrl+C` in the terminal.

**Want to restart?** Just run `npm start` again.

**Lost your student ID?** Register again - it will be generated automatically.

Happy delivering! 🚁💊

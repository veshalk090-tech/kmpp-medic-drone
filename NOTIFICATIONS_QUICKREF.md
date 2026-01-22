# AeroDrop Notification System - Quick Reference

## 🚀 Quick Start

### 1. Install Packages
```bash
npm install
```

### 2. Create .env File
```bash
cp .env.example .env
```

### 3. Edit .env with Credentials
```env
# Gmail Settings
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Twilio Settings
TWILIO_ACCOUNT_SID=ACxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

### 4. Update Staff in database.js
```javascript
staff: [
    {
        id: 'STAFF001',
        email: 'doctor@clinic.edu.my',    // ← Required
        phone: '+60123456789'              // ← Required
    }
]
```

### 5. Start Server
```bash
npm start
```

### 6. Test
Open http://localhost:3000 and place an order

---

## 📱 Notification Methods

| Method | Speed | Best For | Setup |
|--------|-------|----------|-------|
| **Browser** | Instant (< 100ms) | Dashboard alerts | ✅ Built-in |
| **Email** | 1-2 seconds | Detailed review | Gmail + App Password |
| **SMS** | 2-3 seconds | Quick alerts | Twilio account |

---

## ⚙️ Configuration

### Gmail Setup
1. [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Generate "App Password"
4. Paste in `.env` EMAIL_PASSWORD

### Twilio Setup
1. [Sign up at Twilio](https://www.twilio.com)
2. Create project
3. Get Account SID, Auth Token, Phone Number
4. Add to `.env`

### Database Setup
Edit `database.js` and add to each staff member:
```javascript
email: "email@clinic.edu.my",
phone: "+60123456789"
```

---

## 🧪 Testing

### Test Browser Notification
1. Open dashboard in browser
2. Place order on main site
3. See alert appear instantly

### Test Email
```bash
npm start
# Place order, check email inbox (1-2 sec)
```

### Test SMS
```bash
npm start
# Place order, check staff phones (2-3 sec)
```

### Test via cURL
```bash
curl -X POST http://localhost:3000/api/orders/place \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STU123",
    "medicines": [{"id": 1, "name": "Medicine", "quantity": 1, "price": 5}],
    "deliveryLocation": "Block A",
    "urgency": "normal"
  }'
```

---

## 🔍 Troubleshooting

### Issue: Email not sending
**Solution:**
- ✅ Check `.env` has EMAIL_USER and EMAIL_PASSWORD
- ✅ Verify Gmail App Password (not regular password)
- ✅ Check "Less Secure Apps" enabled
- ✅ Run: `npm start` and watch logs

### Issue: SMS not sending
**Solution:**
- ✅ Check Twilio credentials in `.env`
- ✅ Verify phone number format: `+60123456789`
- ✅ Ensure Twilio account has balance
- ✅ Check staff phones in database have country code

### Issue: Browser notification not showing
**Solution:**
- ✅ Make sure server is running (`npm start`)
- ✅ Check browser console for errors
- ✅ Verify WebSocket connection (Network tab)
- ✅ Allow browser notifications when prompted

---

## 📊 What Gets Notified

### Email Contains:
✅ Order ID
✅ Student name & ID
✅ Full medicine list with prices
✅ Delivery location
✅ Urgency level (color-coded)
✅ Special notes
✅ Order timestamp

### SMS Contains:
✅ Order ID
✅ Student name
✅ Urgency level
✅ Dashboard login reminder

### Browser Contains:
✅ Order ID
✅ Student name
✅ Medicines count
✅ Urgency level
✅ Quick action buttons

---

## 📈 Server Logs

When order is placed, you'll see:
```
📢 Sending notifications for order: SKY-A1B2C3D4
✅ Email notification sent to: [email1@gmail.com, email2@gmail.com]
✅ SMS sent to +60123456789: SM1234567890abc
✅ SMS sent to +60198765432: SM0987654321def
✅ Browser notification emitted to staff
```

---

## 🎯 Notification Flow

```
Order Placed
    ↓
3 Notifications Sent (simultaneously):
├── Browser (instant)
├── Email (1-2 sec)
└── SMS (2-3 sec)
    ↓
Staff Receives All 3
    ↓
Staff Reviews & Approves
    ↓
Order Status: "approved"
    ↓
Drone Assigned
    ↓
Medicine Delivered ✅
```

---

## 🔐 Security

✅ Credentials in `.env` (not in code)
✅ Use Gmail App Password (not main password)
✅ Use environment variables
✅ Don't share `.env` file
✅ Never commit `.env` to git

---

## 📝 Files

**Created:**
- `notifications.js` - Notification module
- `.env.example` - Credentials template
- `NOTIFICATIONS_SETUP.md` - Full setup guide
- `NOTIFICATION_IMPLEMENTATION.md` - Feature summary
- `NOTIFICATION_EXAMPLE.js` - Example flow

**Modified:**
- `package.json` - Added dependencies
- `server-enhanced.js` - Added notification calls
- `app.js` - Updated order submission

---

## 🎓 Functions

### In notifications.js:

```javascript
// Send email only
sendEmailNotification(emails, orderData)

// Send SMS only
sendSmsNotification(phones, orderData)

// Send browser notification only
sendBrowserNotification(io, orderData)

// Send ALL three
sendAllNotifications(io, staffData, orderData)
```

### In server-enhanced.js:

```javascript
// Triggered when order placed
POST /api/orders/place
→ Calls sendAllNotifications()
→ Sends all 3 notification types
→ Returns success response
```

---

## 💡 Pro Tips

1. **Test email first** - Easiest to debug
2. **Monitor Twilio balance** - SMS has costs
3. **Keep staff numbers updated** - Critical for SMS
4. **Check browser console** - Good for debugging
5. **Monitor server logs** - See notification status
6. **Use test accounts** - Don't spam real numbers

---

## 🚨 Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Email fails | Wrong credentials | Check `.env` file |
| SMS fails | Twilio setup | Add credentials to `.env` |
| Browser fail | Server down | Run `npm start` |
| No notifications | No staff emails | Add emails to database |
| Wrong email | Staff record missing | Update staff in database.js |

---

## 📞 Support

Check these files for help:
- `NOTIFICATIONS_SETUP.md` - Complete setup guide
- `NOTIFICATION_IMPLEMENTATION.md` - Feature details
- `NOTIFICATION_EXAMPLE.js` - Example workflow
- `notifications.js` - Function comments

---

**Version:** 1.0
**Updated:** January 20, 2026
**System:** AeroDrop Medical Drone Delivery

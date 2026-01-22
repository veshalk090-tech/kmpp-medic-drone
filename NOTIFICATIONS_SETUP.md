# AeroDrop Notification System Setup Guide

## Overview
This system sends **Email, SMS, and Browser/Desktop notifications** to clinic staff when students place medicine orders.

## What Gets Notified

### 🔔 Browser/Desktop Notifications
- **Instant real-time alerts** when order is placed
- Works even if browser tab is not active
- Shows order details and urgency level

### 📧 Email Notifications
- Detailed HTML email with order information
- Sent to all clinic staff members
- Includes student name, location, medicines, and urgency

### 📱 SMS Notifications
- Brief text message alert to staff phones
- Quick notification option for staff on-the-go
- Includes order ID and urgency level

---

## Installation Steps

### 1. Install Required Packages
```bash
npm install nodemailer twilio
```

The packages are already added to `package.json`. Just run:
```bash
npm install
```

### 2. Create `.env` File
Copy `.env.example` to `.env` and configure your credentials:

```bash
cp .env.example .env
```

### 3. Configure Email (Gmail)

#### Option A: Use Gmail App Password (Recommended)
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" if not already enabled
3. Go to "App passwords" 
4. Select "Mail" and "Windows Computer"
5. Copy the generated 16-character password

Update `.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxxxxxxxxxxxxxx
```

#### Option B: Use Gmail Less Secure App
1. Go to [Less Secure Apps](https://myaccount.google.com/lesssecureapps)
2. Enable "Allow less secure apps"
3. Use your Gmail password directly

### 4. Configure SMS (Twilio)

1. Sign up at [Twilio.com](https://www.twilio.com)
2. Get your **Account SID** and **Auth Token** from dashboard
3. Get a **Twilio Phone Number** (e.g., +1234567890)
4. Add staff phone numbers to database

Update `.env`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

### 5. Update Database Staff Records

Ensure staff members have email and phone fields in `database.js`:

```javascript
staff: [
    {
        id: 'STAFF001',
        username: 'admin',
        password: 'password123',
        fullName: 'Dr. Ahmad',
        role: 'pharmacist',
        email: 'ahmad@clinic.edu.my',     // ← Add this
        phone: '+60123456789',              // ← Add this
        shift: 'morning'
    },
    // ... more staff
]
```

---

## How It Works

### When a Student Places an Order:

1. **Browser Notification** (Instant)
   - All connected admin dashboard users see alert immediately
   - Shows order ID, student name, and urgency

2. **Email Notification** (Within 1-2 seconds)
   - HTML email sent to all clinic staff
   - Contains full order details with medicines list
   - Professional formatting with AeroDrop branding

3. **SMS Notification** (Within 2-3 seconds)
   - Text message sent to staff phones
   - Brief alert with order ID and urgency
   - Staff can check dashboard for details

### Real-Time Dashboard Updates

The dashboard receives live updates via WebSocket:
```javascript
// Automatically shows new orders in pending list
// Notification badge shows count of unreviewed orders
// Staff can approve and assign drones immediately
```

---

## Testing the Notifications

### Method 1: Test API Directly
```bash
curl -X POST http://localhost:3000/api/orders/place \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STU123",
    "medicines": [
      {"id": 1, "name": "Paracetamol", "quantity": 2, "price": 2.50}
    ],
    "deliveryLocation": "Block A Hostel",
    "urgency": "normal",
    "notes": "Test order"
  }'
```

### Method 2: Use Website
1. Open http://localhost:3000
2. Add medicines to cart
3. Click "Proceed to Checkout"
4. Fill in delivery details
5. Submit order
6. Watch for notifications!

### Method 3: Terminal Check
When order is placed, you'll see logs:
```
✅ Email notification sent to: [ahmad@clinic.edu.my]
✅ SMS sent to +60123456789: MESSAGE_SID
✅ Browser notification emitted to staff
```

---

## Troubleshooting

### Email Not Sending?
- ✅ Check `.env` file has correct Gmail credentials
- ✅ Verify "App Password" or "Less Secure Apps" enabled
- ✅ Check server logs for error messages
- ✅ Test with: `node -e "require('./notifications').sendEmailNotification(['test@gmail.com'], {orderId: 'TEST', studentName: 'Test', studentId: 'STU123', urgency: 'normal', medicines: [], totalPrice: 0, createdAt: new Date(), deliveryLocation: 'Test', notes: ''})"`

### SMS Not Sending?
- ✅ Check Twilio Account SID and Auth Token in `.env`
- ✅ Verify Twilio phone number format (+country-code-number)
- ✅ Ensure staff phone numbers have country code
- ✅ Check Twilio account has credits/active trial
- ✅ Test with: `node -e "require('./notifications').sendSmsNotification(['+60123456789'], {orderId: 'TEST', studentName: 'Test'})"`

### Browser Notifications Not Showing?
- ✅ Server must send Socket.IO events (should be automatic)
- ✅ Check browser console for errors
- ✅ Verify WebSocket connection: Check Network tab in DevTools
- ✅ Allow browser notifications if prompted

---

## Features

✅ **Email Features:**
- Professional HTML formatting
- Color-coded urgency levels
- Medicine list with prices
- Student information
- Order ID and timestamp

✅ **SMS Features:**
- Concise message format
- Order ID included
- Urgency level indicated
- Works on all phones

✅ **Browser Features:**
- Real-time notification
- Works while browsing
- Shows in notification center
- Can set desktop alerts

---

## Security Notes

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use environment variables** - Don't hardcode credentials
3. **Restrict email access** - Use app-specific passwords, not main password
4. **SMS billing** - Twilio charges per SMS, monitor usage
5. **Staff privacy** - Only share notifications with authorized staff

---

## Advanced Customization

### Change Email Template
Edit `notifications.js` → `sendEmailNotification()` function

### Change SMS Message
Edit `notifications.js` → `sendSmsNotification()` function

### Change Notification Recipients
Edit `server-enhanced.js` → `/api/orders/place` endpoint

### Add Sound Alerts
Edit HTML to add audio element:
```html
<audio autoplay>
  <source src="notification-sound.mp3" type="audio/mpeg">
</audio>
```

---

## Support

For issues or questions:
1. Check server logs: `npm start`
2. Check browser console for WebSocket errors
3. Verify `.env` configuration
4. Test API endpoints with curl or Postman
5. Check email/Twilio service status pages

---

**Last Updated:** January 20, 2026
**System:** AeroDrop - Medical Drone Delivery Service

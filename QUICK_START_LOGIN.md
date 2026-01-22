# Quick Start Guide - Login System

## 🚀 Testing the Login System (2 minutes)

### Step 1: Open Application
```
Visit: http://localhost:3000
```

### Step 2: You'll See Login Page
The application automatically redirects to the login page if not logged in.

### Step 3: Try Demo Account (Auto-Fill Method)
1. **Click on username credential** `nurse.siti`
   - Username field auto-fills
   
2. **Click on password credential** `password123`
   - Password field auto-fills

3. **Click "Sign In"**
   - System validates credentials
   - Shows success message: "✅ Welcome, Nurse Siti Nurhaliza!"
   - Auto-redirects to main dashboard

### Step 4: Explore Dashboard
- See all medicines
- Click medicine to view details
- Add medicines to cart
- Submit orders

### Step 5: Check Your Profile
- Click 👤 (profile icon) in header
- See your name, role, and staff info
- Click "Logout" to return to login

---

## 📋 All Demo Credentials

| Role | Username | Password | Status |
|------|----------|----------|--------|
| Nurse (Morning) | `nurse.siti` | `password123` | ✅ Active |
| Nurse (Night) | `nurse.siti.2` | `password123` | ✅ Active |
| Pharmacist (Afternoon) | `pharmacist.ahmad` | `password123` | ✅ Active |
| Pharmacist (Night) | `pharmacist.ahmad.2` | `password123` | ✅ Active |
| Admin | `admin.lee` | `password123` | ✅ Active |
| Drone Operator | `operator.ravi` | `operator.ravi.2` | ✅ Active |
| Drone Operator (Evening) | `operator.ravi.2` | `password123` | ✅ Active |

---

## 🔐 How Login Works

```
1. User visits http://localhost:3000
   ↓
2. System checks if logged in (sessionStorage)
   ↓
3. NO SESSION → Redirect to login.html
   ↓
4. User enters username & password (or uses demo credentials)
   ↓
5. Click "Sign In" button
   ↓
6. Server validates against staff database
   ↓
7. VALID → Return token + user data
   ↓
8. login.js stores in browser sessionStorage
   ↓
9. Auto-redirect to index.html
   ↓
10. Dashboard loads and shows user profile
```

---

## 🎨 Login Page Features

### Visual Elements
- ✨ Malaysia Madani green gradient background
- 🟢 Animated floating background shapes
- 💳 Professional white card design
- 📱 Mobile-responsive layout

### Interactive Elements
- 📝 Username & Password input fields
- 🔵 Sign In button with loading spinner
- 📋 Demo credentials with clickable auto-fill
- ✅/❌ Success/Error message banners
- 🚪 Logout button in profile

---

## 🔑 Session Management

### What Gets Stored
When you login, two items are stored in browser memory:

1. **Token** (for authentication)
   ```
   Key: aerodrop_session_token
   Value: TOKEN-xxxxx-xxxxx-xxxxx
   ```

2. **User Data** (for profile)
   ```
   Key: aerodrop_user_data
   Value: {
       "id": "STAFF001",
       "fullName": "Nurse Siti Nurhaliza",
       "role": "nurse"
   }
   ```

### How It Works
- ✅ Login → Session saved
- ✅ Refresh page → Session restored (you stay logged in)
- ✅ Close browser tab → Session cleared (security feature)
- ✅ Logout → Session deleted

---

## 🧪 Testing Scenarios

### Scenario 1: First-Time Login
1. Open http://localhost:3000
2. See login page
3. Enter demo credentials
4. Click Sign In
5. See dashboard (logged in)

### Scenario 2: Page Refresh
1. While logged in, press F5
2. Session persists
3. Still see dashboard (not logged out)
4. User name still visible in profile

### Scenario 3: Invalid Credentials
1. Enter wrong password
2. Click Sign In
3. See error message: "Invalid credentials"
4. Stay on login page (not logged in)

### Scenario 4: Logout
1. Click 👤 profile button
2. Click "Logout"
3. Redirected to login page
4. Try to go back to dashboard → redirected to login

### Scenario 5: Auto-Fill Credentials
1. Click on `nurse.siti` credential
2. Username field auto-fills
3. Click on `password123` credential
4. Password field auto-fills
5. Can now click Sign In directly

---

## 📊 Files Modified/Created

### New Files
```
✨ login.html       - Login page UI (complete with styling)
✨ login.js         - Login functionality & session management
✨ LOGIN_SYSTEM.md  - Full documentation
```

### Modified Files
```
📝 app.js          - Added login checks & user profile display
📝 server-enhanced.js - Already has /api/staff/login endpoint
```

---

## 🚨 Troubleshooting

### Problem: Stuck on login page
**Solution**: Check if credentials are correct
- Verify username spelling
- Check CAPS LOCK is off
- Try a different demo account

### Problem: Login works but can't see medicines
**Solution**: Page might be loading
- Wait a few seconds
- Check browser console for errors (F12)
- Refresh page (F5)

### Problem: Can't logout
**Solution**: Try these steps
1. Click 👤 profile button
2. Scroll down to find Logout button
3. Click red "Logout" button
4. Should redirect to login page

### Problem: Forget credentials
**Solution**: All demo credentials are on login page
- Scroll to "Demo Credentials" section
- Click on username to auto-fill
- Click on password to auto-fill

---

## 💡 Key Features

✅ **Instant Login** - Auto-fill demo credentials
✅ **Session Persistent** - Stay logged in on page refresh
✅ **Mobile Friendly** - Works on phones & tablets
✅ **Clear Feedback** - Success & error messages
✅ **Professional Design** - Malaysia Madani branding
✅ **Multiple Roles** - Different staff accounts
✅ **Easy Logout** - One-click logout from profile

---

## 🎯 What's Next?

### To Test Full Application:
1. ✅ Login with demo account
2. ✅ Browse medicines with details
3. ✅ Add medicines to cart
4. ✅ Submit orders
5. ✅ View order history
6. ✅ Receive notifications
7. ✅ View dashboard analytics

### To Customize Credentials:
Edit `database.js` and update staff array with your credentials

### To Deploy to Production:
- [ ] Implement HTTPS/SSL
- [ ] Use bcrypt for password hashing
- [ ] Implement JWT tokens
- [ ] Add password reset functionality
- [ ] Enable 2-factor authentication
- [ ] Add rate limiting
- [ ] Implement audit logging

---

## 📞 Support

**Server Running**: http://localhost:3000
**Login Page**: http://localhost:3000/login.html
**Dashboard**: http://localhost:3000/index.html (after login)
**API**: http://localhost:3000/api

---

**Status**: ✅ LOGIN SYSTEM READY TO USE
**Last Updated**: January 20, 2026
**Test Time**: 2-5 minutes

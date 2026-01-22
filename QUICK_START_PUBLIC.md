# 🛸 KMPP MEDIC DRONE AERODROP - Quick Start Guide

## ✅ Setup Complete!

Your application is now configured for **public access** with the branding **KMPP MEDIC DRONE AERODROP**.

---

## 🚀 Running Locally

### Option 1: Using Windows Batch Script (Recommended)
```bash
start-public.bat
```
This will:
- Check for Node.js and npm
- Install dependencies
- Start the server
- Show your local and network IP

### Option 2: Using PowerShell Script
```powershell
powershell -ExecutionPolicy Bypass -File start-public.ps1
```

### Option 3: Manual Command Line
```bash
npm install
npm start
```

---

## 🌐 Accessing Your Application

### Local Network (Same WiFi)
1. Start the server with `start-public.bat`
2. See the **IPv4 Address** displayed
3. From any device on the network, visit: `http://YOUR_IP:3000`

**Example**: `http://192.168.1.100:3000`

### From Chrome/Google
1. Open Chrome
2. Go to Google.com (or address bar)
3. Type: `http://YOUR_IP:3000`
4. Your KMPP MEDIC DRONE AERODROP site loads!

---

## 📱 Available Pages

| Page | URL | Purpose |
|------|-----|---------|
| **Main Store** | `http://YOUR_IP:3000/` | Browse medicines |
| **Login** | `http://YOUR_IP:3000/login.html` | Staff/Student login |
| **Dashboard** | `http://YOUR_IP:3000/dashboard.html` | Admin dashboard |
| **Tracker** | `http://YOUR_IP:3000/tracker.html` | Drone GPS tracking |

---

## 🌍 Going Public on Internet

For **public internet access** (not just local network):

### Easiest: Railway.app
1. Create account: https://railway.app
2. Connect your GitHub repository
3. Railway auto-deploys your app
4. Get public URL like: `https://kmpp-medic-drone-aerodrop.railway.app`

**Cost**: Free tier ($5/month credit)

### Other Options
- **Heroku**: https://heroku.com (paid)
- **Render**: https://render.com (free tier + paid)
- **Replit**: https://replit.com (free)

See `PUBLIC_DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file in the root directory:

```env
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
```

### CORS Settings
✅ **Already enabled** for all origins
- All browsers can access: Chrome, Firefox, Safari, Edge, etc.
- All methods supported: GET, POST, PUT, PATCH, DELETE

---

## 🧪 Testing Public Access

### From Your Computer
```bash
# In terminal, get your IP
ipconfig

# Then access from browser
http://YOUR_IPv4_ADDRESS:3000
```

### From Another Device
1. **Android/iPhone**: Open browser, visit `http://YOUR_IP:3000`
2. **Windows PC**: Open Chrome, visit `http://YOUR_IP:3000`
3. **Mac**: Open Safari, visit `http://YOUR_IP:3000`

### Test Port is Open
Visit: https://www.canyouseeme.org/
- Enter your IP and port 3000
- If "Success", it's publicly accessible!

---

## ✨ What's New

### HTML Updates
- ✅ `index.html` - "KMPP MEDIC DRONE AERODROP" in title
- ✅ `dashboard.html` - Updated branding
- ✅ `login.html` - Updated branding
- ✅ `tracker.html` - Updated branding

### Server Configuration
- ✅ Binds to `0.0.0.0` for network access
- ✅ CORS enabled for all origins
- ✅ Supports HTTP and WebSockets
- ✅ Production-ready logging

### Deployment Ready
- ✅ `Procfile` - For Heroku/Railway
- ✅ `start-public.bat` - Windows batch script
- ✅ `start-public.ps1` - PowerShell script
- ✅ `.env.example` - Environment template
- ✅ `package.json` - Updated with public script

---

## 🐛 Troubleshooting

### "Cannot connect from other device"
- Make sure server is running
- Check firewall allows port 3000
- Verify you're on same network
- Use correct IPv4 address (not 127.0.0.1)

### "Port 3000 already in use"
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID 1234 /F
```

### "Module not found"
```bash
# Reinstall dependencies
npm install
```

### "CORS errors"
✅ Already fixed! All origins allowed.

---

## 📚 Resources

- **Express.js Docs**: https://expressjs.com
- **Node.js Docs**: https://nodejs.org
- **Railway Docs**: https://docs.railway.app
- **CORS Guide**: https://enable-cors.org

---

## 🎯 Next Steps

1. ✅ Run `start-public.bat` to start server
2. ✅ Open browser to `http://localhost:3000`
3. ✅ Test from another device on WiFi
4. ✅ Deploy to Railway/Heroku when ready
5. ✅ Share your public URL!

---

**KMPP MEDIC DRONE AERODROP v2.0.0**  
**Status**: ✅ Ready for Public Access  
**Last Updated**: January 2026

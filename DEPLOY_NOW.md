# 🚀 DEPLOY TO PUBLIC IN 3 MINUTES

Your code is ready and committed to Git! Follow these 3 simple steps:

---

## STEP 1: Push to GitHub (2 minutes)

### A. Create GitHub Account
1. Go to **https://github.com/signup**
2. Enter email, create password
3. Verify your email
4. Create account

### B. Create Repository
1. Go to **https://github.com/new**
2. Repository name: `kmpp-medic-drone`
3. Make it **PUBLIC**
4. Click "Create repository"

### C. Get Your Remote URL
After creating repo, GitHub shows you commands. Copy the HTTPS URL:
```
https://github.com/YOUR_USERNAME/kmpp-medic-drone.git
```

### D. Push Code from PowerShell
```powershell
cd 'C:\Users\ASUS\Documents\PROGRAMMING\DRONE'
& 'C:\Program Files\Git\bin\git.exe' remote add origin https://github.com/YOUR_USERNAME/kmpp-medic-drone.git
& 'C:\Program Files\Git\bin\git.exe' branch -M main
& 'C:\Program Files\Git\bin\git.exe' push -u origin main
```

---

## STEP 2: Deploy on Render (1 minute)

### A. Create Render Account
1. Go to **https://render.com**
2. Click "Sign Up"
3. Use your GitHub account (easiest)
4. Authorize GitHub

### B. Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Select your **kmpp-medic-drone** repository
3. Configuration:
   - **Name:** kmpp-medic-drone
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### C. Add Environment Variables
Click "Advanced" and add:
```
NODE_ENV = production
PORT = 3000
JWT_SECRET = kmpp-drone-medic-super-secret-2026
JWT_EXPIRES_IN = 24h
```

### D. Deploy!
Click **"Create Web Service"**
Wait 2-3 minutes...

---

## STEP 3: Your Public Link!

After deployment completes, Render shows your URL:

```
https://kmpp-medic-drone.render.com
```

---

## ✅ DONE!

Your website is now PUBLIC and LIVE!

- **Share this link:** https://kmpp-medic-drone.render.com
- **Works in:** Chrome, Firefox, Safari, Edge, Mobile
- **Accessible from:** Anywhere in the world
- **Searchable on:** Google (after indexing)

---

## TEST IT

Open in browser:
```
https://kmpp-medic-drone.render.com
```

Try:
1. Student Registration
2. Login as staff (username: `nurse`, password: `password123`)
3. Browse medicines
4. Place an order

---

## TROUBLESHOOTING

**Build failed?**
- Render shows build log with error
- Common: Typo in environment variables
- Check `server-enhanced.js` starts on `process.env.PORT`

**Site not loading?**
- Wait 5 minutes (first startup is slow)
- Check Render dashboard for errors
- Refresh browser

**Need MongoDB?**
- Currently using in-memory fallback
- Optional: Create free MongoDB Atlas account
- Update `MONGO_URI` environment variable

---

## QUESTIONS?

All code works locally at:
```
http://localhost:3000
```

If Render has issues, test locally first to isolate problem.

---

**Status:** ✅ Code ready, Git initialized, ready to deploy!

**Time to live:** ~10 minutes

**Your link:** https://kmpp-medic-drone.render.com (after deployment)

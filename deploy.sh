#!/bin/bash
# KMPP Medic Drone - Quick Deployment Script
# This script prepares your app for deployment on Render.com

echo "🚀 KMPP Medic Drone - Deployment Preparation"
echo "==========================================="

# Step 1: Install dependencies
echo "✅ Step 1: Installing dependencies..."
npm install

# Step 2: Check if .env exists
echo "✅ Step 2: Checking environment setup..."
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating with production values..."
    cat > .env << EOF
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
JWT_SECRET=kmpp-drone-medic-super-secret-key-production-$(date +%s)
JWT_EXPIRES_IN=24h
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/kmpp-drone-medic
LOG_LEVEL=info
TWILIO_ACCOUNT_SID=AC_your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
EOF
    echo "✅ .env created (update with real MongoDB URI)"
else
    echo "✅ .env already exists"
fi

# Step 3: Check files
echo "✅ Step 3: Verifying critical files..."
files=("server-enhanced.js" "config-mongo.js" "auth.js" "logger.js" "package.json")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✓ $file"
    else
        echo "   ✗ MISSING: $file"
    fi
done

# Step 4: Display next steps
echo ""
echo "🎉 Deployment Preparation Complete!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Push to GitHub:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'KMPP Medic Drone - Ready for deployment'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOUR_USERNAME/kmpp-medic-drone.git"
echo "   git push -u origin main"
echo ""
echo "2. Deploy on Render:"
echo "   - Go to https://render.com"
echo "   - Sign up with GitHub"
echo "   - Create new Web Service"
echo "   - Select this repository"
echo "   - Deploy!"
echo ""
echo "3. Update MongoDB URI in Render environment"
echo "4. Your site will be live at: https://kmpp-medic-drone.render.com"
echo ""
echo "✨ Good luck! Your website will be live soon! ✨"

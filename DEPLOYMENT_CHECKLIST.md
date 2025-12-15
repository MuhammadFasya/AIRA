# 🚀 AIRA Deployment Checklist

**Date Started:** December 16, 2025  
**Status:** Ready to Deploy ✅

---

## ✅ Pre-Deployment Checklist (COMPLETED)

- [x] Backend requirements.txt updated with gunicorn and psycopg2-binary
- [x] Procfile created for Railway
- [x] app.py updated to handle PORT environment variable
- [x] Frontend axiosClient.js configured to use VITE_API_BASE
- [x] 12 beta tester accounts created
- [x] All UI polish completed (background, bubbles, text justification)

---

## 📋 DEPLOYMENT STEPS

### **PART 1: Deploy Backend to Railway (20 minutes)**

#### Step 1.1: Push Code to GitHub
```powershell
# Make sure you're in the project root
cd C:\Aira-Web

# Check what files will be committed
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Prepare for production deployment - add Railway config"

# Push to GitHub
git push origin main
```

#### Step 1.2: Create Railway Project
1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your **AIRA** repository
6. Click **"Deploy Now"**

#### Step 1.3: Configure Root Directory
⚠️ **IMPORTANT:** Railway needs to know your backend is in a subfolder!

1. In Railway dashboard, click on your service
2. Go to **Settings** tab
3. Find **"Root Directory"** setting
4. Set it to: `backend`
5. Click **"Save"**

#### Step 1.4: Add PostgreSQL Database
1. In Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Wait for database to provision (~30 seconds)
4. Railway automatically sets `DATABASE_URL` environment variable! ✨

#### Step 1.5: Set Environment Variables
1. Click on your **backend service** (not database)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add these variables ONE BY ONE:

```
SECRET_KEY = your-super-secret-key-here-change-this-in-production
JWT_SECRET_KEY = another-secret-key-for-jwt-tokens-change-this-too
GEMINI_API_KEY = your-actual-gemini-api-key-here
GEMINI_API_URL = https://generativelanguage.googleapis.com
FLASK_DEBUG = False
JWT_EXP_DAYS = 7
```

⚠️ **IMPORTANT:** 
- Replace `your-super-secret-key-here-change-this-in-production` with a random string (at least 32 characters)
- Replace `another-secret-key-for-jwt-tokens-change-this-too` with another random string
- Replace `your-actual-gemini-api-key-here` with your real Gemini API key

💡 **Tip:** Generate random secret keys with:
```powershell
# In PowerShell, run this to generate a random key:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

#### Step 1.6: Create Database Tables
1. In Railway dashboard, click your **backend service**
2. Go to **"Deployments"** tab
3. Wait for deployment to complete (green checkmark)
4. Click on the deployment
5. Click **"View Logs"**
6. You should see: `Starting AIRA backend` ✅

7. Now run the user creation script:
   - Go back to **backend service**
   - Click **"Settings"** → Scroll to **"Custom Start Command"**
   - Temporarily set to: `python create_users.py && gunicorn app:app`
   - Click **"Save"** (this will redeploy)
   - Wait for deployment
   - Check logs - you should see all 12 users created
   - Go back to **Settings** → Remove custom start command (leave blank)
   - It will redeploy again with normal `gunicorn app:app` command

#### Step 1.7: Test Backend Deployment
1. In Railway dashboard, find your **backend URL**
   - It looks like: `https://your-app-name.up.railway.app`
2. Copy this URL - you'll need it for frontend!
3. Test in browser: `https://your-app-name.up.railway.app/`
   - Should see: `{"service": "AIRA backend", "status": "healthy"}`
4. Test debug endpoint: `https://your-app-name.up.railway.app/debug/gemini`
   - Should see: `{"ok": true, "status_code": 200}`

✅ **Backend Deployed Successfully!** Copy your Railway URL for the next step.

---

### **PART 2: Deploy Frontend to Netlify (15 minutes)**

#### Step 2.1: Update Frontend for Production
1. Make sure your code is pushed to GitHub (already done in Step 1.1)

#### Step 2.2: Create Netlify Site
1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **"Deploy with GitHub"**
4. Authorize Netlify to access GitHub
5. Select your **AIRA** repository
6. Click on it

#### Step 2.3: Configure Build Settings
⚠️ **IMPORTANT:** Set these EXACTLY as shown:

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

#### Step 2.4: Set Environment Variable
1. Before clicking "Deploy", scroll down to **"Advanced build settings"**
2. Click **"Add environment variables"**
3. Add this variable:

```
Key: VITE_API_BASE
Value: https://your-app-name.up.railway.app
```

⚠️ **IMPORTANT:** Replace `https://your-app-name.up.railway.app` with YOUR actual Railway backend URL from Step 1.7 (NO trailing slash!)

4. Click **"Deploy site"**

#### Step 2.5: Wait for Deployment
1. Netlify will build your site (~2-3 minutes)
2. You'll see a progress log
3. Wait for **"Site is live"** message ✅

#### Step 2.6: Test Frontend Deployment
1. Click on the **site URL** (looks like: `https://random-name-123.netlify.app`)
2. You should see your AIRA login page! 🎉
3. Try logging in with: `alex@aira.com` / `alex2025`
4. Send a test message: "Hello Aira!"
5. Check that AI responds

✅ **Frontend Deployed Successfully!**

---

### **PART 3: Final Testing (10 minutes)**

#### Test Checklist:
- [ ] Login works with beta tester account
- [ ] Chat sends messages and receives AI responses
- [ ] Profile picture upload works
- [ ] Theme switching (dark/light) works
- [ ] Language switching (English/Indonesian) works
- [ ] Search modal works
- [ ] History modal works
- [ ] Background scrolls correctly (no white space)
- [ ] Chat bubbles positioned at edges
- [ ] Text is justified

#### Test with Multiple Accounts:
1. Open site in regular browser: login with `alex@aira.com`
2. Open site in incognito: login with `sarah@aira.com`
3. Both should be able to chat independently ✅

---

## 🎉 POST-DEPLOYMENT

### Share with Beta Testers:

**Email Template:**
```
Subject: Welcome to AIRA Beta Testing! 🚀

Hi [Name],

Thanks for joining our beta test! Here are your login credentials:

🌐 App URL: https://your-site.netlify.app
📧 Email: [their_email@aira.com]
🔑 Password: [their_password2025]

What to test:
✓ Chat with Aira about your day/feelings
✓ Try uploading a profile picture
✓ Switch between dark/light themes
✓ Use the search feature to find past messages
✓ Check the history to see your conversations

Please report any bugs or feedback! Your input is invaluable.

Thank you! 💙
AIRA Team
```

### Beta Tester Accounts:
1. alex@aira.com / alex2025
2. sarah@aira.com / sarah2025
3. miguel@aira.com / miguel2025
4. priya@aira.com / priya2025
5. jordan@aira.com / jordan2025
6. emma@aira.com / emma2025
7. lucas@aira.com / lucas2025
8. zara@aira.com / zara2025
9. ryan@aira.com / ryan2025
10. nina@aira.com / nina2025
11. test1@aira.com / password123
12. demo@aira.com / demo123

---

## 🔧 TROUBLESHOOTING

### Backend Issues:

**"Service won't start"**
- Check Railway logs for errors
- Verify all environment variables are set
- Make sure Root Directory is set to `backend`

**"Database errors"**
- Make sure PostgreSQL database is attached
- Check that DATABASE_URL environment variable exists
- Try redeploying

**"Gemini API not working"**
- Verify GEMINI_API_KEY is correct
- Test the /debug/gemini endpoint

### Frontend Issues:

**"Can't connect to backend"**
- Check VITE_API_BASE environment variable
- Make sure Railway backend URL is correct (no trailing slash)
- Check browser console for CORS errors

**"Login not working"**
- Check Network tab in browser dev tools
- Verify backend is responding to /auth/login
- Make sure users were created (check Railway logs)

**"White screen / blank page"**
- Check browser console for errors
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Verify build completed successfully in Netlify

---

## 📊 MONITORING

### Railway Dashboard:
- Check **Metrics** tab for CPU/Memory usage
- Monitor **Logs** for errors
- Review **Deployments** for uptime

### Netlify Dashboard:
- Check **Analytics** for visitor stats
- Monitor **Functions** logs (if using)
- Review **Deploy** history

---

## 🎯 SUCCESS CRITERIA

✅ Backend health endpoint returns 200  
✅ Frontend loads without errors  
✅ Users can login  
✅ AI responds to messages  
✅ All features work (profile, theme, search, history)  
✅ Multiple users can use simultaneously  
✅ No console errors  

---

## 📝 NOTES

- Railway may sleep if inactive (free tier) - first request after sleep takes ~30 seconds
- Netlify builds are instant if no changes to code
- Keep your secret keys SECURE - never commit to GitHub!
- PostgreSQL data persists across deploys
- Check Railway logs regularly for errors

---

## 🚀 YOU'RE READY TO DEPLOY!

Follow each step carefully. Don't skip steps. If something goes wrong, check the troubleshooting section.

Good luck! 🎉

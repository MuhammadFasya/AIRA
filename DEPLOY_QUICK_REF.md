# ⚡ Quick Deploy Reference Card

## 🎯 MUST-DO BEFORE DEPLOYING

### 1. Generate Secret Keys
```powershell
# Run TWICE to get 2 different keys
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 2. Get Your Gemini API Key
- Go to: https://aistudio.google.com/apikey
- Copy your API key

---

## 🚂 RAILWAY BACKEND

### Settings to Configure:
```
Root Directory: backend
```

### Environment Variables:
```
SECRET_KEY = [paste first secret key]
JWT_SECRET_KEY = [paste second secret key]
GEMINI_API_KEY = [paste your Gemini API key]
GEMINI_API_URL = https://generativelanguage.googleapis.com
FLASK_DEBUG = False
JWT_EXP_DAYS = 7
```

### Temporary Command (to create users):
```
Custom Start Command: python create_users.py && gunicorn app:app
```
(Remove this after users are created)

---

## 🌐 NETLIFY FRONTEND

### Build Settings:
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

### Environment Variables:
```
VITE_API_BASE = [your Railway URL without trailing slash]
```
Example: `https://aira-backend-production.up.railway.app`

---

## ✅ VERIFICATION CHECKLIST

### Backend Health Check:
```
https://your-railway-url.up.railway.app/
Should return: {"service": "AIRA backend", "status": "healthy"}
```

### Gemini Test:
```
https://your-railway-url.up.railway.app/debug/gemini
Should return: {"ok": true, "status_code": 200}
```

### Frontend Test:
1. Open Netlify URL
2. Login: `alex@aira.com` / `alex2025`
3. Send message: "Hello Aira!"
4. Verify AI responds

---

## 🐛 QUICK FIXES

### Backend won't start?
- Check: Root Directory = `backend`
- Check: All env variables set
- Check: PostgreSQL database attached

### Frontend can't connect?
- Check: VITE_API_BASE has no trailing slash
- Check: Railway URL is correct
- Check: Backend is running (visit health endpoint)

### Login fails?
- Check: Users created (Railway logs)
- Check: Backend /auth/login responds (Network tab)
- Check: JWT_SECRET_KEY is set

---

## 📱 TEST ACCOUNTS

Login with any of these:
- alex@aira.com / alex2025
- sarah@aira.com / sarah2025
- test1@aira.com / password123

(See BETA_TESTING_GUIDE.md for all 12 accounts)

---

## 🎉 DONE? SHARE WITH TESTERS!

Send them:
1. Your Netlify URL
2. Their unique login credentials
3. Testing instructions from BETA_TESTING_GUIDE.md

---

**Full instructions:** See DEPLOYMENT_CHECKLIST.md  
**Troubleshooting:** See QUICK_DEPLOY.md

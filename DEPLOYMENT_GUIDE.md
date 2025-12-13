# 🚀 Aira Deployment Guide

Complete guide to deploy Aira to production.

## 🎯 Deployment Overview

### Options

| Platform             | Frontend | Backend | Cost      | Difficulty |
| -------------------- | -------- | ------- | --------- | ---------- |
| **Vercel + Heroku**  | ✅       | ✅      | Free tier | ⭐⭐       |
| **Netlify + Heroku** | ✅       | ✅      | Free tier | ⭐⭐       |
| **Render**           | ✅       | ✅      | Free tier | ⭐⭐       |
| **AWS**              | ✅       | ✅      | Paid      | ⭐⭐⭐⭐   |
| **DigitalOcean**     | ✅       | ✅      | Paid      | ⭐⭐⭐     |

**Recommended for beginners:** Vercel (Frontend) + Heroku (Backend)

---

## 🌐 OPTION 1: Vercel (Frontend) + Heroku (Backend)

### Frontend Deployment: Vercel

#### Step 1.1: Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub, GitLab, or email
4. Verify email

#### Step 1.2: Connect GitHub Repository

1. Click "New Project"
2. Click "Import Git Repository"
3. Paste your GitHub repo URL
4. Click "Import"

**OR: Deploy from local machine**

```powershell
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# ? Set up and deploy "c:\Aira-Web\frontend"? y
# ? Which scope do you want to deploy to? (select your name)
# ? Link to existing project? n
# ? What's your project's name? aira-frontend
# ? In which directory is your code? ./
# ? Want to modify these settings before deploying? n
```

#### Step 1.3: Configure Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   ```
   VITE_API_URL=https://aira-backend.herokuapp.com
   ```
5. Redeploy: Click "Deployments" → "..." → "Redeploy"

**Your frontend is live!** 🎉

---

### Backend Deployment: Heroku

#### Step 2.1: Create Heroku Account

1. Go to https://www.heroku.com
2. Click "Sign up"
3. Create account
4. Verify email

#### Step 2.2: Install Heroku CLI

**Windows:**

```powershell
# Download installer from https://devcenter.heroku.com/articles/heroku-cli
# Or use Chocolatey
choco install heroku-cli
```

**Verify installation:**

```powershell
heroku --version
```

#### Step 2.3: Login to Heroku

```powershell
heroku login
```

This opens browser to login.

#### Step 2.4: Create Heroku App

```powershell
cd c:\Aira-Web\backend

# Create app (choose unique name)
heroku create aira-backend-yourname

# Check it was created
heroku apps
```

#### Step 2.5: Create Procfile

In `backend/` directory, create `Procfile`:

```
web: gunicorn -w 4 -b 0.0.0.0:$PORT app:app
```

#### Step 2.6: Install Gunicorn

```powershell
# Activate virtual environment
venv\Scripts\activate

# Install gunicorn
pip install gunicorn

# Update requirements.txt
pip freeze > requirements.txt
```

#### Step 2.7: Initialize Git Repository

```powershell
cd backend

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit"
```

#### Step 2.8: Deploy to Heroku

```powershell
# Set Heroku as remote
heroku git:remote -a aira-backend-yourname

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**Your backend is live!** 🎉

#### Step 2.9: Update Frontend API URL

1. Go to Vercel Dashboard
2. Select your project → Settings → Environment Variables
3. Update `VITE_API_URL`:
   ```
   https://aira-backend-yourname.herokuapp.com
   ```
4. Trigger redeploy

---

## 🌐 OPTION 2: Netlify (Frontend) + Railway (Backend)

### Frontend: Netlify

#### Step 1: Create Netlify Account

1. Go to https://www.netlify.com
2. Sign up
3. Verify email

#### Step 2: Deploy from Git

1. Click "New site from Git"
2. Select GitHub
3. Authorize Netlify
4. Select your repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. Click "Deploy"

#### Step 3: Set Environment Variables

1. Go to Site Settings
2. Click "Build & Deploy" → "Environment"
3. Add:
   ```
   VITE_API_URL=https://aira-backend-railway.up.railway.app
   ```
4. Trigger redeploy: Site → "Trigger deploy" → "Deploy site"

### Backend: Railway

#### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize

#### Step 2: Create New Project

1. Click "New Project"
2. Select "GitHub Repo"
3. Find and select your Aira repo
4. Authorize

#### Step 3: Configure Python Environment

1. Click "Add Service" → "GitHub Repo"
2. Select backend folder
3. Configure:
   - **Python version**: 3.11
   - **Start command**: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`

#### Step 4: Add Environment Variables

1. Go to project settings
2. Click "Variables"
3. Add:
   ```
   FLASK_ENV=production
   FLASK_DEBUG=False
   ```
4. Deploy

---

## 🌐 OPTION 3: Single Platform - Render

### Render.com (Both Frontend & Backend)

#### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize

#### Step 2: Deploy Backend

1. Click "New +"
2. Select "Web Service"
3. Connect GitHub
4. Select repository
5. Configure:
   - **Name**: aira-backend
   - **Environment**: Python 3
   - **Build command**: `pip install -r requirements.txt`
   - **Start command**: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
   - **Root directory**: backend
6. Click "Create Web Service"

#### Step 3: Deploy Frontend

1. Click "New +"
2. Select "Static Site"
3. Connect GitHub
4. Configure:
   - **Name**: aira-frontend
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Publish directory**: `frontend/dist`
5. Add environment variable:
   - **VITE_API_URL**: `https://aira-backend.onrender.com`
6. Click "Create Static Site"

---

## 📊 Production Checklist

Before deploying, ensure:

### Frontend

- [ ] `npm run build` completes without errors
- [ ] No console errors in browser dev tools
- [ ] All API calls use environment variables
- [ ] `.env` file is in `.gitignore`
- [ ] Images are optimized
- [ ] Responsive design tested on mobile

### Backend

- [ ] `FLASK_DEBUG=False` in production
- [ ] CORS restricted to allowed origins
- [ ] `.env` file is in `.gitignore`
- [ ] All dependencies in `requirements.txt`
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Database migrations run (if applicable)

---

## 🔒 Security Best Practices

### Frontend

```javascript
// ✅ Use environment variables
const API_URL = import.meta.env.VITE_API_URL;

// ❌ Don't hardcode URLs
// const API_URL = 'http://localhost:5000';
```

### Backend

```python
# ✅ Restrict CORS to specific domain
CORS(app, resources={
    r"/*": {
        "origins": "https://your-domain.com",
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

# ❌ Don't allow all origins in production
# CORS(app, resources={r"/*": {"origins": "*"}})
```

### Environment Variables

- Never commit `.env` files
- Use `.env.example` for reference
- Rotate secrets regularly
- Use platform-specific secret management

---

## 📈 Custom Domain Setup

### Vercel + Custom Domain

1. Go to Vercel Dashboard
2. Select project
3. Go to Settings → Domains
4. Enter your domain
5. Follow DNS instructions
6. Update domain provider DNS records

### Heroku + Custom Domain

```powershell
# Add domain
heroku domains:add www.yourdomain.com

# Get DNS target
heroku domains:info www.yourdomain.com

# Update domain provider DNS records
# Add CNAME pointing to your Heroku DNS target
```

---

## 📊 Monitoring & Logs

### Vercel

1. Dashboard → Deployments
2. Click deployment
3. Click "Logs" tab
4. View build & runtime logs

### Heroku

```powershell
# View logs
heroku logs --tail -a aira-backend-yourname

# Watch logs in real-time
heroku logs --tail -a aira-backend-yourname --follow

# Filter logs
heroku logs -a aira-backend-yourname | grep ERROR
```

### Railway

1. Go to project
2. Click on service
3. View "Logs" tab
4. Real-time streaming

---

## 🆘 Troubleshooting Deployment

### Frontend Not Building

```powershell
# Check build locally
cd frontend
npm run build

# Check for errors
npm run lint
```

### Backend Not Starting

```powershell
# Check Procfile exists
cat Procfile

# Test locally with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Check requirements.txt
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update requirements"
```

### API Connection Errors

1. Check backend URL in frontend environment variables
2. Verify CORS is configured correctly
3. Test endpoint with Postman/curl
4. Check backend logs

```powershell
# Test backend endpoint
curl https://aira-backend-yourname.herokuapp.com/

# Should return: {"message": "AIRA API running", ...}
```

### Database Issues (Future)

```powershell
# Run migrations
heroku run python migrate.py -a aira-backend-yourname

# Check database
heroku pg:psql -a aira-backend-yourname
```

---

## 💡 Performance Optimization

### Frontend

```bash
# Generate build report
npm run build -- --report

# Analyze bundle
npm install -g webpack-bundle-analyzer
```

### Backend

```python
# Add caching
from flask_caching import Cache
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

# Add rate limiting
from flask_limiter import Limiter
limiter = Limiter(app)
```

---

## 📚 Useful Resources

- [Vercel Docs](https://vercel.com/docs)
- [Heroku Docs](https://devcenter.heroku.com)
- [Netlify Docs](https://docs.netlify.com)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)

---

## ✅ Deployment Success Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] API calls working from frontend
- [ ] Environment variables configured
- [ ] Custom domain set up (optional)
- [ ] SSL/HTTPS enabled
- [ ] Logs monitored
- [ ] Error handling working
- [ ] Performance acceptable
- [ ] Security best practices followed

---

**Your app is live! 🎉**

**Next steps:**

1. Share your deployed app
2. Monitor performance
3. Collect user feedback
4. Plan future features
5. Scale infrastructure as needed

---

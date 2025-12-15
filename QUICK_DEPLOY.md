# 🚀 Quick Deployment Checklist

## ✅ Polish Completed!

### What We Just Fixed:

1. ✅ Removed all debug print statements from backend
2. ✅ Enhanced typing indicator ("Aira is typing..." with blue dots)
3. ✅ Added Toast notifications for errors (network/server failures)
4. ✅ Added scroll-to-bottom button when user scrolls up
5. ✅ Fixed background scrolling (now repeats vertically)
6. ✅ Added Aira identity system prompt (responds to "who are you")

---

## 📋 Before Deployment - Quick Tests

### Test These Features:

- [ ] Login with test1@aira.com / password123
- [ ] Send message "hello" - AI should respond
- [ ] Send message "who are you" - Should introduce as Aira
- [ ] Scroll up in long chat - scroll button should appear
- [ ] Click scroll button - should scroll to bottom
- [ ] Upload profile picture - should save and display
- [ ] Switch theme (dark/light) - should persist
- [ ] Switch language (English/Indonesian) - UI should update
- [ ] Click Search - search through messages
- [ ] Click History - view chat topics
- [ ] Disconnect internet - error toast should appear
- [ ] Test on mobile viewport - responsive design

---

## 🔐 Production Requirements

### Backend (Railway)

#### 1. Add to requirements.txt:

```
gunicorn==21.2.0
psycopg2-binary==2.9.9
```

#### 2. Create `Procfile` in backend folder:

```
web: gunicorn app:app
```

#### 3. Update app.py (add to bottom):

```python
if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()

    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

#### 4. Environment Variables for Railway:

```
SECRET_KEY=<generate-random-32-char-string>
JWT_SECRET_KEY=<generate-different-random-string>
GEMINI_API_KEY=AIzaSyBiY6Uw1UiopSfJ-EVvR7I3vy8BBKIdNww
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
FLASK_DEBUG=False
JWT_EXP_DAYS=7
```

### Frontend (Netlify)

#### Environment Variable:

```
VITE_API_BASE=https://your-backend.railway.app
```

#### Build Settings:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`

---

## 🎯 Deployment Steps

### 1. Backend First (Railway)

1. Sign up at https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo
4. Set root directory to `backend`
5. Add PostgreSQL database
6. Add environment variables (see above)
7. Deploy!
8. Copy your Railway URL: `https://xxxxx.railway.app`

### 2. Then Frontend (Netlify)

1. Sign up at https://netlify.com
2. New site → Import from Git
3. Select your repo
4. Configure build settings (see above)
5. Add `VITE_API_BASE` environment variable with Railway URL
6. Deploy!

### 3. Create Test Users

In Railway console, run:

```bash
python create_users.py
```

### 4. Test Production

1. Visit your Netlify URL
2. Login with test1@aira.com / password123
3. Send a test message
4. Verify everything works!

---

## 🐛 Common Issues

### "Cannot connect to server"

- ✅ Check Railway backend is running
- ✅ Verify VITE_API_BASE in Netlify matches Railway URL
- ✅ Check Railway logs for errors

### "Database error"

- ✅ Ensure PostgreSQL is added in Railway
- ✅ Check DATABASE_URL environment variable is set
- ✅ Run create_users.py to seed database

### "CORS error"

- ✅ Backend has flask-cors installed
- ✅ Check CORS allows your Netlify domain

---

## 📞 When You're Ready

Tell me:

1. "Railway backend deployed at: [URL]"
2. "Netlify frontend deployed at: [URL]"

And I'll help you test and troubleshoot! 🚀

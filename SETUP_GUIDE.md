# 🚀 Aira Setup Guide - Step by Step

Complete guide to get Aira running on your machine.

## ✅ Prerequisites Checklist

- [ ] Node.js (v16+) installed - [Download](https://nodejs.org/)
- [ ] Python (v3.8+) installed - [Download](https://www.python.org/)
- [ ] Git (optional) - [Download](https://git-scm.com/)
- [ ] Code Editor (VS Code recommended) - [Download](https://code.visualstudio.com/)
- [ ] Terminal access (PowerShell, Command Prompt, or Bash)

## 📋 Project Structure Overview

```
Aira-Web/
├── frontend/          ← React app runs on :3000
├── backend/           ← Flask API runs on :5000
└── README.md          ← Main documentation
```

---

## 🎯 PART 1: Frontend Setup

### Step 1.1: Navigate to Frontend Directory

```powershell
cd c:\Aira-Web\frontend
```

### Step 1.2: Install Node Dependencies

```powershell
npm install
```

**Expected output:**

```
added 200+ packages in 2m
```

**If error occurs:**

- Delete `node_modules` folder: `rmdir /s node_modules`
- Delete `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

### Step 1.3: Create Environment File

```powershell
# Copy example env file
copy .env.example .env

# Verify it was created
Get-Content .env
```

**Content of `.env`:**

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Aira
VITE_APP_VERSION=0.1.0
```

### Step 1.4: Start Development Server

```powershell
npm run dev
```

**Expected output:**

```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

**The app should automatically open in your browser!**

### Step 1.5: Verify Frontend

✅ You should see:

- Aira logo in top-left
- Theme toggle button (sun/moon icon)
- "Start a conversation" message
- Greeting component

### Frontend Troubleshooting

**Port 3000 already in use:**

```powershell
# Find process using port 3000
Get-Process | where {$_.Name -eq "node"}

# Kill the process or use different port
npm run dev -- --port 3001
```

**npm not found:**

```powershell
# Verify Node installation
node --version
npm --version

# If not found, reinstall Node.js
```

**Module not found errors:**

```powershell
# Remove node_modules and reinstall
rmdir /s node_modules
rm package-lock.json
npm install
```

---

## 🎯 PART 2: Backend Setup

### Step 2.1: Open New Terminal/PowerShell Window

Keep the frontend terminal running! Open a **new** PowerShell window.

### Step 2.2: Navigate to Backend Directory

```powershell
cd c:\Aira-Web\backend
```

### Step 2.3: Create Python Virtual Environment

```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# You should see (venv) at the beginning of your terminal line
```

**If `python` not found:**

```powershell
# Try python3
python3 -m venv venv
python3 -m venv venv\Scripts\activate
```

### Step 2.4: Install Python Dependencies

```powershell
pip install -r requirements.txt
```

**Expected output:**

```
Collecting flask==3.0.0
...
Successfully installed flask flask-cors python-dotenv textblob
```

### Step 2.5: Create Environment File

```powershell
# Copy example env file
copy .env.example .env

# Verify
Get-Content .env
```

**Content should show:**

```env
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
```

### Step 2.6: Run Flask App

```powershell
python app.py
```

**Expected output:**

```
==================================================
🧠 AIRA BACKEND STARTING
==================================================
Debug Mode: True
Host: 0.0.0.0
Port: 5000
==================================================
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://0.0.0.0:5000
```

### Step 2.7: Test Backend

Open **another terminal/PowerShell** and test:

```powershell
# Test health check endpoint
curl http://localhost:5000/

# Test chat endpoint
$body = @{message="I'm feeling stressed"} | ConvertTo-Json
curl -Method POST -Uri http://localhost:5000/chat `
  -ContentType "application/json" `
  -Body $body
```

Or use a REST client like Postman:

- **URL**: `http://localhost:5000/chat`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**: `{"message": "Hello Aira"}`

### Backend Troubleshooting

**Virtual environment not activating:**

```powershell
# Try absolute path
& "c:\Aira-Web\backend\venv\Scripts\Activate.ps1"

# Or use python directly without venv
python -m pip install -r requirements.txt
python app.py
```

**Port 5000 already in use:**

```powershell
# Find and kill process
Get-Process | where {$_.Name -eq "python"} | Stop-Process

# Or change port in .env
# FLASK_PORT=5001
```

**Module not found (ModuleNotFoundError):**

```powershell
# Ensure venv is activated (should see (venv) prefix)
# Then reinstall
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 🎯 PART 3: Test Full Integration

### Step 3.1: Verify Both Servers Running

You should have:

- ✅ Frontend running on `http://localhost:3000`
- ✅ Backend running on `http://localhost:5000`

### Step 3.2: Test Chat Flow

1. Open browser to `http://localhost:3000`
2. Type a message (e.g., "I'm stressed")
3. Click Send button
4. Verify you see:
   - Your message on the right (blue)
   - Aira's response on the left (gray)
   - Loading animation while waiting

### Step 3.3: Test Features

✅ **Test Theme Toggle**

- Click sun/moon icon in navbar
- Verify dark/light theme switches
- Refresh page - theme should persist

✅ **Test Sidebar**

- Click hamburger menu on mobile view
- Sidebar should slide in/out
- "New Chat" button should appear

✅ **Test Chat Input**

- Type multi-line message (Shift+Enter)
- Press Enter to send
- Message should clear after sending

✅ **Test Settings**

- Click menu icon in sidebar
- Click "Settings"
- Modal should appear with centered layout
- Try changing theme, font size
- Click "Done" to close

---

## 📊 Example Conversation Flows

### Example 1: Stress Detection

```
User: "I'm so stressed about my exams"
Aira: "Stress can be overwhelming, and I appreciate you sharing
       that with me. Let's take this one step at a time."
Sentiment: negative
Intent: stres
```

### Example 2: Tiredness Detection

```
User: "I'm really tired, I can't focus anymore"
Aira: "I hear you. Feeling tired is completely normal. Have you
       thought about taking a break to recharge?"
Sentiment: negative
Intent: capek
```

### Example 3: Reset Command

```
User: "reset"
Aira: "Chat history cleared" (backend returns success)
Frontend: Clears messages, shows greeting again
```

---

## 🔍 Project Files Quick Reference

### Frontend Key Files

| File                           | Purpose                |
| ------------------------------ | ---------------------- |
| `src/components/Navbar.jsx`    | Top navigation bar     |
| `src/components/Sidebar.jsx`   | Left sidebar nav       |
| `src/components/ChatArea.jsx`  | Message display        |
| `src/components/ChatInput.jsx` | Message input          |
| `src/pages/Home.jsx`           | Main chat page         |
| `src/App.jsx`                  | Root component         |
| `index.css`                    | Global styles          |
| `tailwind.config.js`           | TailwindCSS config     |
| `vite.config.js`               | Vite dev server config |

### Backend Key Files

| File               | Purpose                        |
| ------------------ | ------------------------------ |
| `app.py`           | Main Flask app & all endpoints |
| `requirements.txt` | Python dependencies            |
| `.env`             | Environment variables          |

---

## 🚀 Useful Commands

### Frontend Commands

```powershell
# Development
npm run dev              # Start dev server

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Code quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier
```

### Backend Commands

```powershell
# Start server
python app.py

# Interactive Python shell
python -i app.py

# List installed packages
pip list

# Freeze dependencies
pip freeze > requirements.txt

# Deactivate virtual environment
deactivate
```

---

## 📱 Mobile Testing

### Test on Your Phone

1. **Find your computer's IP address:**

   ```powershell
   ipconfig
   # Look for "IPv4 Address" under your network adapter
   # Example: 192.168.1.100
   ```

2. **Connect phone to same WiFi network**

3. **Open browser on phone:**

   ```
   http://192.168.1.100:3000
   ```

4. **Verify:**
   - Sidebar is hidden (tap hamburger to open)
   - Layout is responsive
   - Touch interactions work

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot POST /chat"

**Solution:**

- Verify Flask is running on port 5000
- Check browser console for error messages
- Test endpoint with curl/Postman

### Issue: "Module not found" (Frontend)

**Solution:**

```powershell
rm -r node_modules
npm install
npm run dev
```

### Issue: "ModuleNotFoundError" (Backend)

**Solution:**

```powershell
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Issue: Styles not loading (CSS not applied)

**Solution:**

```powershell
# Clear Vite cache
rmdir /s .vite
npm run dev
```

### Issue: "CORS error"

**Solution:**

- Verify Flask-CORS is installed: `pip list`
- Check CORS configuration in `app.py`
- Verify frontend URL in request

---

## 📞 Getting Help

1. **Check terminal output** - Look for error messages
2. **Check browser console** - Press F12, go to Console tab
3. **Check API response** - Use Postman to test endpoints
4. **Read documentation** - See `frontend/README.md` and `backend/README.md`

---

## ✨ You're All Set! 🎉

Now you're ready to:

- ✅ Chat with Aira
- ✅ Test all features
- ✅ Modify code and see live updates
- ✅ Build additional features
- ✅ Deploy to production

### Next Steps:

1. [ ] Explore the code structure
2. [ ] Add custom responses in `backend/app.py`
3. [ ] Customize styling in `frontend/src/index.css`
4. [ ] Add new components to frontend
5. [ ] Deploy to Vercel & Heroku
6. [ ] Add database integration

---

**Happy coding! 🚀**

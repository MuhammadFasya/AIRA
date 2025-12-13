# 🧠 Aira - Mental Health Chatbot for Gen-Z Students

A modern, empathetic web chatbot designed specifically for Gen-Z students seeking mental health support. Built with React + Vite (frontend) and Flask (backend).

## 📸 Project Overview

**Aira** is a comprehensive web application featuring:

- ✨ Beautiful, responsive UI with light/dark theme support
- 💬 Real-time chat interface with empathetic AI responses
- 🎯 Sentiment and intent detection
- 📱 Mobile-first responsive design
- 🔄 Stateful conversation management
- 🚀 Modern tech stack

### Key Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme** - Eye-friendly themes with persistent preference
- **Empathetic AI** - Intelligent sentiment analysis and intent detection
- **Modern UI** - Built with TailwindCSS for stunning visuals
- **Real-time Chat** - Instant message delivery and responses
- **Chat History** - Track recent conversations
- **Settings Modal** - Customize user preferences
- **Accessibility** - WCAG compliant components

## 📂 Project Structure

```
Aira-Web/
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation bar with theme toggle
│   │   │   ├── Sidebar.jsx     # Collapsible sidebar navigation
│   │   │   ├── ChatArea.jsx    # Message display area
│   │   │   ├── ChatInput.jsx   # Message input component
│   │   │   └── Greeting.jsx    # Welcome greeting
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Main chat interface
│   │   │   ├── Login.jsx       # Login page
│   │   │   └── Settings.jsx    # Settings modal
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── index.html              # HTML template
│   ├── package.json            # Dependencies
│   ├── tailwind.config.js      # TailwindCSS config
│   ├── vite.config.js          # Vite config
│   └── README.md               # Frontend documentation
│
├── backend/                     # Flask REST API
│   ├── app.py                  # Main Flask application
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment variables
│   └── README.md              # Backend documentation
│
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16+) and npm (v8+)
- **Python** (v3.8+) and pip
- **Git** (optional)

### Installation & Running

#### Step 1: Clone or Download Project

```bash
# If using git
git clone <repository-url>
cd Aira-Web

# Or navigate to the project folder
cd Aira-Web
```

#### Step 2: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will open at `http://localhost:3000`

#### Step 3: Setup Backend (in a new terminal)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask app
python app.py
```

The backend will start at `http://localhost:5000`

#### Step 4: Start Chatting! 🎉

Open your browser and visit `http://localhost:3000`

## 🏗️ Architecture

### Frontend Architecture

```
React App
├── Navbar (top-fixed)
│   ├── Logo + Branding
│   ├── Theme Toggle
│   └── Mobile Menu
├── Sidebar (left collapsible)
│   ├── New Chat Button
│   ├── Search Bar
│   ├── Chat History
│   └── Settings & Profile
└── Main Content Area
    ├── Greeting (initial state)
    ├── ChatArea (messages)
    └── ChatInput (message input)
```

### Backend Architecture

```
Flask API
├── Middleware
│   ├── CORS Configuration
│   └── JSON Processing
├── Core Logic
│   ├── Sentiment Detection (TextBlob)
│   ├── Intent Classification
│   ├── Response Generation
│   └── Chat History Management
└── API Endpoints
    ├── GET / (health check)
    ├── POST /chat (main endpoint)
    ├── POST /reset (clear history)
    ├── GET /history (fetch history)
    └── GET /context (get metadata)
```

## 🔌 API Endpoints

### Chat Endpoint

**POST** `/chat`

Send a user message and receive an empathetic response.

**Request:**

```json
{
  "message": "I'm feeling stressed about my studies"
}
```

**Response:**

```json
{
  "response": "Stress can be overwhelming, and I appreciate you sharing that...",
  "sentiment": "negative",
  "intent": "stres",
  "history_length": 1
}
```

### Reset Endpoint

**POST** `/reset`

Clear chat history and start fresh.

**Response:**

```json
{
  "message": "Chat history cleared",
  "status": "success"
}
```

### Health Check

**GET** `/`

Verify API is running.

**Response:**

```json
{
  "message": "AIRA API running",
  "status": "healthy",
  "timestamp": "2024-12-04T10:30:00"
}
```

## 🎯 Intent Categories

Aira detects the following user intents:

| Intent          | Keywords                                                  | Response Type               |
| --------------- | --------------------------------------------------------- | --------------------------- |
| **capek/tired** | capek, tired, lelah, exhausted, drain, fatigue            | Encouragement to rest       |
| **stres**       | stress, stres, anxious, worry, pressure, overwhelm        | Pressure management         |
| **sedih**       | sad, sedih, depressed, down, unhappy, blue                | Emotional validation        |
| **marah**       | angry, marah, furious, irritated, annoyed, frustrated     | Anger acknowledgement       |
| **kesepian**    | lonely, alone, kesepian, isolated, solitude, disconnected | Connection offering         |
| **general**     | (default)                                                 | Generic empathetic response |

## 🎨 UI/UX Features

### Theme System

- Light theme (default)
- Dark theme with OLED-friendly colors
- System preference detection
- Persistent preference storage

### Responsive Breakpoints

- **Mobile**: < 768px (sidebar hidden, hamburger menu)
- **Tablet**: 768px - 1024px (adaptive layout)
- **Desktop**: > 1024px (full sidebar visible)

### Components

| Component     | Purpose         | Features                                 |
| ------------- | --------------- | ---------------------------------------- |
| **Navbar**    | Top navigation  | Logo, theme toggle, mobile menu          |
| **Sidebar**   | Left navigation | New chat, history, settings, profile     |
| **ChatArea**  | Message display | Auto-scroll, timestamps, loading state   |
| **ChatInput** | User input      | Auto-expand textarea, keyboard shortcuts |
| **Greeting**  | Welcome screen  | Random messages, time-based greeting     |

## 🔧 Technologies Used

### Frontend

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **TailwindCSS** - Utility CSS framework
- **Axios** - HTTP client
- **Lucide Icons** - Icon library

### Backend

- **Flask 3** - Web framework
- **Flask-CORS** - Cross-origin support
- **TextBlob** - NLP sentiment analysis
- **python-dotenv** - Environment management

## 📋 Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Aira
VITE_APP_VERSION=0.1.0
```

### Backend (.env)

```env
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
# GEMINI_API_KEY=your_key_here (optional)
```

## 🚀 Deployment

### Frontend Deployment Options

#### Vercel (Recommended)

```bash
npm install -g vercel
cd frontend
vercel
```

#### Netlify

```bash
npm install -g netlify-cli
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

#### GitHub Pages

1. Set `base` in `vite.config.js`
2. Run `npm run build`
3. Deploy `dist/` folder

### Backend Deployment Options

#### Heroku

```bash
heroku create aira-backend
git push heroku main
```

#### PythonAnywhere

1. Sign up at pythonanywhere.com
2. Upload project files
3. Configure web app settings

#### AWS / GCP / Azure

Deploy as containerized application (Docker) or traditional VPS

### Production Checklist

- [ ] Set `FLASK_DEBUG=False`
- [ ] Update CORS origins to specific domain
- [ ] Use HTTPS/SSL
- [ ] Set up database (SQLite → PostgreSQL)
- [ ] Configure logging
- [ ] Add authentication (optional)
- [ ] Set up monitoring/alerts

## 🧪 Testing

### Frontend Testing

```bash
cd frontend
npm run lint     # Run ESLint
npm run format   # Format with Prettier
```

### Backend Testing

```bash
cd backend
# Test with curl
curl http://localhost:5000/
curl -X POST http://localhost:5000/chat -H "Content-Type: application/json" -d '{"message":"test"}'

# Or use Postman / Thunder Client
```

## 🐛 Troubleshooting

### Frontend Issues

**Port 3000 already in use:**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

**Module not found errors:**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Styling not working:**

```bash
npm run build
npm run preview
```

### Backend Issues

**ModuleNotFoundError:**

```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

**Port 5000 in use:**

```bash
lsof -i :5000
kill -9 <PID>
```

**CORS errors:**

- Verify Flask-CORS is installed
- Check CORS configuration in `app.py`
- Ensure frontend URL is whitelisted

## 🔮 Future Enhancements

- [ ] User authentication & profiles
- [ ] Database integration (PostgreSQL)
- [ ] Advanced NLP with Gemini API
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Export chat history
- [ ] Real-time notifications
- [ ] Resource recommendations
- [ ] Mood tracking & analytics
- [ ] Crisis support hotline integration

## 📚 Documentation

- [Frontend README](./frontend/README.md) - Detailed frontend documentation
- [Backend README](./backend/README.md) - Detailed backend documentation
- [React Docs](https://react.dev)
- [Flask Docs](https://flask.palletsprojects.com/)
- [TailwindCSS Docs](https://tailwindcss.com)

## 💡 Tips & Best Practices

### Development

- Use React DevTools for component inspection
- Use Postman for API testing
- Enable source maps for debugging
- Use `.env` files for sensitive data

### Performance

- Minimize re-renders with React.memo
- Lazy load components with React.lazy
- Use Vite's code splitting
- Compress images & assets

### Security

- Validate user input on backend
- Use HTTPS in production
- Set secure CORS policy
- Implement rate limiting
- Never commit `.env` files

## 📞 Support & Contact

For issues or questions:

1. Check the documentation in `/frontend/README.md` and `/backend/README.md`
2. Review troubleshooting sections
3. Check GitHub issues (if applicable)
4. Contact: [your contact info]

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

Built with ❤️ for Gen-Z students seeking mental health support.

---

**Start building Aira today! 🚀**

### Quick Links

- [Frontend Setup](./frontend/README.md)
- [Backend Setup](./backend/README.md)
- [Deploy to Vercel](https://vercel.com)
- [Deploy to Heroku](https://www.heroku.com)

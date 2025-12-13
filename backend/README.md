# Aira Backend - Flask REST API

Welcome to the Aira backend! This is the empathetic AI chatbot engine built with Flask, designed specifically for Gen-Z mental health support.

## 📁 Project Structure

```
backend/
├── app.py               # Main Flask application and API endpoints
├── requirements.txt     # Python dependencies
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- Python (v3.8 or higher)
- pip (Python package manager)
- Virtual environment (recommended)

### Installation

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Create virtual environment:**

   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

5. **Run the Flask app:**

   ```bash
   python app.py
   ```

   The API will be available at `http://localhost:5000`

## 📝 API Endpoints

### 1. Health Check

**GET** `/`

Check if the API is running.

**Response:**

```json
{
  "message": "AIRA API running",
  "status": "healthy",
  "timestamp": "2024-12-04T10:30:00.000000"
}
```

### 2. Chat Endpoint

**POST** `/chat`

Send a message and receive an empathetic response from Aira.

**Request:**

```json
{
  "message": "I'm feeling really stressed about my exams"
}
```

**Response:**

```json
{
  "response": "Stress can be overwhelming, and I appreciate you sharing that with me. Let's take this one step at a time.",
  "sentiment": "negative",
  "intent": "stres",
  "history_length": 1
}
```

### 3. Reset Chat

**POST** `/reset`

Clear chat history and reset conversation context.

**Response:**

```json
{
  "message": "Chat history cleared",
  "status": "success"
}
```

### 4. Get Chat History

**GET** `/history`

Retrieve the complete chat history.

**Response:**

```json
{
  "history": [
    {
      "user": "I'm feeling tired",
      "aira": "I hear you...",
      "sentiment": "negative",
      "intent": "capek",
      "timestamp": "2024-12-04T10:30:00.000000"
    }
  ],
  "length": 1
}
```

### 5. Get Conversation Context

**GET** `/context`

Get metadata about the current conversation.

**Response:**

```json
{
  "context": {
    "mood": null,
    "sentiment": "negative",
    "topics_discussed": []
  }
}
```

## 🧠 Chat Logic & Features

### Sentiment Detection

Analyzes user messages using TextBlob to detect sentiment:

- **Positive**: Polarity > 0.1
- **Negative**: Polarity < -0.1
- **Neutral**: Everything else

### Intent Detection

Identifies user emotions and concerns:

- **capek/tired** - Fatigue, exhaustion
- **stres** - Stress, anxiety, pressure
- **sedih** - Sadness, depression
- **marah** - Anger, frustration
- **kesepian** - Loneliness, isolation

### Empathetic Responses

Each intent category has multiple empathetic response templates:

```python
EMPATHETIC_RESPONSES = {
    'capek': [
        "I hear you. Feeling tired is completely normal...",
        "It sounds like you're exhausted...",
        "That fatigue is real..."
    ],
    'stres': [...],
    'sedih': [...],
    'marah': [...],
    'kesepian': [...],
    'general': [...]
}
```

### Reset Command Detection

Automatically handles user requests to start fresh:

- Keywords: `reset`, `clear`, `start over`, `new chat`, `restart`

## 🔧 Configuration

### Environment Variables (.env)

```env
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_HOST=0.0.0.0
FLASK_PORT=5000

# Optional: Gemini API for enhanced responses
GEMINI_API_KEY=your_api_key_here

# Optional: Database configuration
DATABASE_URL=sqlite:///aira.db
```

### CORS Configuration

- Enabled for all origins: `CORS(app, resources={r"/*": {"origins": "*"}})`
- For production, restrict to specific domains

## 📦 Dependencies

See `requirements.txt`:

- **Flask** (3.0.0) - Web framework
- **Flask-CORS** (4.0.0) - Cross-Origin Resource Sharing
- **python-dotenv** (1.0.0) - Environment variable management
- **TextBlob** (0.17.1) - NLP for sentiment analysis

## 🚀 Running the Backend

### Development Mode

```bash
python app.py
```

Features:

- Debug mode enabled
- Hot reload on file changes
- Detailed error messages
- Verbose logging

### Production Mode

Set in `.env`:

```env
FLASK_ENV=production
FLASK_DEBUG=False
```

## 🔌 Integration with Frontend

The frontend (React) communicates with this backend:

```javascript
// Frontend example (axios)
const response = await axios.post("http://localhost:5000/chat", {
  message: userMessage,
});

const { response: aiResponse, sentiment, intent } = response.data;
```

## 📊 Data Storage

Currently, chat history is stored in memory:

- Clears when server restarts
- Suitable for development
- Not suitable for production

### Future Enhancements:

- SQLite database for persistence
- PostgreSQL for scalability
- Redis for caching

## 🤖 Optional: Gemini API Integration

To enhance responses with Google Gemini API:

1. **Get API Key**: https://ai.google.dev
2. **Set environment variable**:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
3. **Modify `generate_empathetic_response()` in `app.py`** to use Gemini for response enhancement

Example implementation:

```python
import google.generativeai as genai

def generate_with_gemini(template, user_message):
    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
    model = genai.GenerativeModel('gemini-pro')

    prompt = f"Given this empathetic template: '{template}', personalize it based on this user message: '{user_message}'"
    response = model.generate_content(prompt)
    return response.text
```

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:5000/

# Send message
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I feel stressed"}'

# Reset chat
curl -X POST http://localhost:5000/reset

# Get history
curl http://localhost:5000/history
```

### Using Postman

1. Create new POST request to `http://localhost:5000/chat`
2. Set header: `Content-Type: application/json`
3. Set body:
   ```json
   {
     "message": "How are you doing?"
   }
   ```
4. Send and check response

### Using Python Requests

```python
import requests

response = requests.post('http://localhost:5000/chat', json={
    'message': 'I am feeling lonely'
})

print(response.json())
```

## 🚀 Deployment

### Deploy to Heroku

```bash
# Create Heroku app
heroku create aira-backend

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Deploy to PythonAnywhere

1. Sign up at https://www.pythonanywhere.com
2. Upload project files
3. Configure web app settings
4. Set WSGI configuration

### Deploy to AWS/GCP/Azure

1. Create compute instance
2. Install Python and dependencies
3. Run with production server (Gunicorn/uWSGI)
4. Set up domain and SSL

### Production Server (Gunicorn)

```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🐛 Troubleshooting

### ModuleNotFoundError

```bash
# Ensure virtual environment is activated
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### CORS Errors

Check that Flask-CORS is installed:

```bash
pip install flask-cors
```

## 📚 Learning Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Flask-CORS](https://flask-cors.readthedocs.io/)
- [TextBlob Documentation](https://textblob.readthedocs.io/)
- [Python HTTP Requests](https://requests.readthedocs.io/)

## 🤝 Contributing

Feel free to enhance Aira with:

- Better sentiment analysis algorithms
- More empathetic response templates
- Database integration
- User authentication
- Advanced NLP models
- Langauge support

## 📄 License

This project is part of Aira, a mental health chatbot for Gen-Z students.

---

**Keep building! 🚀**

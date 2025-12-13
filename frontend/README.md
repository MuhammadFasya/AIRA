# Aira Frontend - React + Vite + TailwindCSS

Welcome to the Aira frontend! This is a modern, responsive web chatbot interface built with React and styled with TailwindCSS.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Navbar.jsx       # Top navigation bar
│   │   ├── Sidebar.jsx      # Left sidebar navigation
│   │   ├── ChatArea.jsx     # Message display area
│   │   ├── ChatInput.jsx    # Message input component
│   │   └── Greeting.jsx     # Welcome greeting
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Main chat page
│   │   ├── Login.jsx        # Login page (placeholder)
│   │   └── Settings.jsx     # Settings modal
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── tailwind.config.js       # TailwindCSS configuration
├── vite.config.js           # Vite configuration
├── postcss.config.js        # PostCSS configuration
├── package.json             # Project dependencies
└── .gitignore              # Git ignore rules

```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:3000`

## 📝 Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build
- **`npm run lint`** - Run ESLint (if configured)
- **`npm run format`** - Format code with Prettier

## 🎨 Features

### Components

#### Navbar
- Aira logo with blue circle badge
- Theme toggle (Light/Dark mode)
- Mobile-responsive hamburger menu
- Sticky positioning at top

#### Sidebar
- Collapsible left navigation
- New Chat button
- Search functionality
- Recent chat history
- User profile access
- Settings button
- Smooth slide animations

#### ChatArea
- Message history display
- User messages (right-aligned, blue)
- Aira responses (left-aligned, gray)
- Auto-scroll to latest message
- Loading indicator with animation
- Empty state with welcome message

#### ChatInput
- Auto-expandable textarea
- Send button with loading state
- Keyboard shortcuts:
  - `Enter` to send
  - `Shift + Enter` for new line
- Character count (optional)
- Mobile-friendly layout

#### Greeting
- Random empathetic greeting messages
- Time-based greeting (Good morning/afternoon/evening)
- Visual indicator dots

### Pages

#### Home
- Main chat interface
- Integrates all components
- Manages chat state with React hooks
- Handles API communication with Flask backend
- Chat history tracking

#### Settings
- Theme selection (Light/Dark)
- Avatar customization (placeholder)
- Font size adjustment (placeholder)
- Notifications toggle (placeholder)
- Clear chat history button
- Modal overlay with blur backdrop

#### Login
- Email/password form (placeholder)
- Future authentication implementation

## 🔌 API Integration

The frontend communicates with the Flask backend at `http://localhost:5000`.

### Endpoints Used

**POST /chat**
```javascript
// Request
{
  "message": "user message"
}

// Response
{
  "response": "aira's empathetic reply",
  "sentiment": "positive/neutral/negative",
  "history_length": 12
}
```

**POST /reset**
```javascript
// Response
{
  "message": "Chat history cleared",
  "status": "success"
}
```

## 🎯 Styling with TailwindCSS

All components use TailwindCSS utility classes for styling:
- Responsive breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Dark mode support with `dark:` prefix
- Smooth transitions and animations
- Custom colors and typography from `tailwind.config.js`

### Key Classes Used

- **Layout**: `flex`, `grid`, `gap`, `p-*`, `m-*`
- **Colors**: `bg-*`, `text-*`, `border-*`
- **Responsive**: `md:`, `lg:` prefixes
- **Dark mode**: `dark:bg-*`, `dark:text-*`
- **Transitions**: `transition-colors`, `duration-300`

## 🌓 Theme System

The app supports light and dark themes:
- Theme preference saved to localStorage
- System preference detection on first load
- Theme toggle in Navbar
- All components styled for both themes
- Smooth transitions between themes

## 📱 Responsive Design

Breakpoints:
- **Mobile**: Default (< 768px)
- **Tablet**: `md` (768px - 1024px)
- **Desktop**: `lg` (1024px+)

Key responsive features:
- Sidebar collapses to hamburger menu on mobile
- Font sizes scale for readability
- Touch-friendly button sizes
- Flexible grid layouts

## 🔧 Configuration Files

### vite.config.js
- React plugin configuration
- Development server on port 3000
- Build optimization settings

### tailwind.config.js
- Content file patterns
- Custom color scheme
- Font family configuration
- Custom animations

### postcss.config.js
- Tailwind CSS processor
- Autoprefixer for browser compatibility

### package.json
- Project metadata
- Dependencies: React 18, Axios, Lucide Icons
- Dev dependencies: Vite, Tailwind, PostCSS
- Build and dev scripts

## 📦 Dependencies

### Production
- **react** (^18.2.0) - UI library
- **react-dom** (^18.2.0) - React rendering
- **axios** (^1.6.0) - HTTP client for API calls
- **lucide-react** (^0.263.1) - Icon library

### Development
- **@vitejs/plugin-react** - Vite React plugin
- **vite** - Build tool and dev server
- **tailwindcss** - Utility CSS framework
- **postcss** & **autoprefixer** - CSS processing
- **eslint** & **prettier** - Code quality tools

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages
1. Update `vite.config.js` with `base: '/Aira-Web/'`
2. Run `npm run build`
3. Push `dist/` folder to GitHub Pages

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### API Connection Errors
- Ensure Flask backend is running on `http://localhost:5000`
- Check CORS configuration in backend
- Verify environment variables in `.env`

### Styling Not Applied
- Clear node_modules: `rm -rf node_modules && npm install`
- Rebuild Tailwind CSS: `npm run build`
- Check `tailwind.config.js` content paths

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)
- [Lucide Icons](https://lucide.dev)

## 📄 License

This project is part of Aira, a mental health chatbot for Gen-Z students.

---

**Happy coding! 🚀**

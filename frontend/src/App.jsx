import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import LoadingScreen from "./components/LoadingScreen";
import Login from "./pages/Login";
import "./index.css";

/**
 * Main App Component
 * - Root application component
 * - Manages global theme state
 * - Handles page routing and settings modal
 * - Applies dark/light theme to entire app
 */
function App() {
  const [isDark, setIsDark] = useState(() => {
    // Check system preference or localStorage
    const saved = localStorage.getItem("aira-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Current authenticated user (null when not signed in)
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("aira_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("aira-theme", isDark ? "dark" : "light");
    // Update document class for Tailwind
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Show splash/loading screen briefly on first load
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = (userObj) => {
    setUser(userObj);
    try {
      localStorage.setItem("aira_user", JSON.stringify(userObj));
    } catch (e) {
      // ignore
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("aira_user");
    localStorage.removeItem("aira_token");
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div
        className={`w-full h-screen flex flex-col transition-colors duration-300 ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
      >
        {isLoading && <LoadingScreen theme={isDark ? "dark" : "light"} />}

        {/* Navigation Bar */}
        <Navbar
          isDark={isDark}
          setIsDark={setIsDark}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          user={user}
          onLogout={handleLogout}
        />

        {/* Main Content: show Login when not authenticated, otherwise Home */}
        <main className="flex-1">
          {!isLoading && !user && <Login onLogin={handleLogin} />}

          {!isLoading && user && <Home isDark={isDark} user={user} />}
        </main>

        {/* Settings Modal */}
        <Settings
          isDark={isDark}
          setIsDark={setIsDark}
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;

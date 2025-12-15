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
    // Check localStorage first, then system preference
    const saved = localStorage.getItem("aira-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleThemeChange = (e) => {
      // Only update if user hasn't manually set a theme
      const saved = localStorage.getItem("aira-theme");
      if (!saved) {
        setIsDark(e.matches);
      }
    };

    // Add listener for system theme changes
    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar collapsed by default
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

  // Theme-aware asset paths (folders in public/assets contain spaces)
  const themeFolder = isDark ? "Dark Mode" : "Light Mode";
  const logoSrc = encodeURI(`/assets/${themeFolder}/Aira.png`);
  const loadingBgSrc = encodeURI(
    `/assets/${themeFolder}/${isDark ? "Loading and Login - DarkBackground.svg" : "Loading and Login-LightBackground.png"}`
  );
  const homeBgSrc = encodeURI(
    `/assets/${themeFolder}/${isDark ? "Home - DarkBackground.svg" : "Home-LightBackground.svg"}`
  );

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

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  return (
    <div className={isDark ? "dark" : ""}>
      <div
        className={`w-full h-screen flex flex-col transition-colors duration-300 ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
      >
        {isLoading && (
          <LoadingScreen
            theme={isDark ? "dark" : "light"}
            logoSrc={logoSrc}
            bgSrc={loadingBgSrc}
          />
        )}

        {/* Navigation Bar - Only show when user is logged in */}
        {!isLoading && user && (
          <Navbar
            isDark={isDark}
            setIsDark={setIsDark}
            logoSrc={logoSrc}
            sidebarOpen={sidebarOpen}
          />
        )}

        {/* Main Content: show Login when not authenticated, otherwise Home */}
        <main className={user ? "flex-1" : "flex-1 h-screen"}>
          {!isLoading && !user && (
            <Login
              onLogin={handleLogin}
              logoSrc={logoSrc}
              bgSrc={loadingBgSrc}
              isDark={isDark}
              setIsDark={setIsDark}
            />
          )}

          {!isLoading && user && (
            <Home
              isDark={isDark}
              user={user}
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          )}
        </main>

        {/* Settings Modal */}
        <Settings
          isDark={isDark}
          setIsDark={setIsDark}
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          user={user}
          onLogout={handleLogout}
          onUserUpdate={handleUserUpdate}
        />
      </div>
    </div>
  );
}

export default App;

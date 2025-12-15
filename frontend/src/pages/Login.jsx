import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import Avatar from "../components/Avatar";

const Login = ({ onLogin, logoSrc, bgSrc, isDark, setIsDark }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleTheme = () => setIsDark(!isDark);

  const themeFolder = isDark ? "Dark Mode" : "Light Mode";
  const themeIconSrc = encodeURI(
    `/assets/${themeFolder}/${isDark ? "Theme - Dark.svg" : "theme-lightButton.svg"}`
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axiosClient.post("/auth/login", { email, password });
      const { access_token, user } = res.data;
      localStorage.setItem("aira_token", access_token);
      localStorage.setItem("aira_user", JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const wrapperStyle = bgSrc
    ? {
        backgroundImage: `url(${bgSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  return (
    <div
      className="w-full h-full flex items-center justify-center p-4 relative"
      style={wrapperStyle}
    >
      {/* Theme Toggle Button - Top Right */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 p-3 rounded-lg transition-colors duration-200 ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
        aria-label="Toggle theme"
        title={isDark ? "Light Mode" : "Dark Mode"}
      >
        <img
          src={themeIconSrc}
          alt="theme toggle"
          className="w-6 h-6 object-contain"
        />
      </button>

      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-800">
        <div className="flex flex-col items-center gap-3 mb-6">
          <Avatar src={logoSrc} alt="Aira" size={80} />
          <h2 className="text-2xl font-bold">Sign in to Aira</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A friendly, empathetic AI companion
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full px-4 py-3 rounded-full border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="w-full px-4 py-3 rounded-full border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className={`w-full py-3 rounded-full font-medium transition-colors ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <span>Don't have an account? </span>
          <button
            className="text-blue-500 hover:text-blue-600 font-medium"
            disabled
          >
            Sign up (coming soon)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

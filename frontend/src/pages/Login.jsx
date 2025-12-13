import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import Avatar from "../components/Avatar";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
        <div className="flex flex-col items-center gap-3 mb-4">
          <Avatar alt="Aira" size={64} />
          <h2 className="text-xl font-semibold">Sign in to Aira</h2>
          <p className="text-sm text-gray-500">
            A friendly, empathetic AI companion
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="w-full mb-3 p-2 rounded border bg-gray-50 dark:bg-gray-700"
          />

          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="w-full mb-4 p-2 rounded border bg-gray-50 dark:bg-gray-700"
          />

          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

          <button
            type="submit"
            className={`w-full py-2 rounded ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          <span>Don't have an account? </span>
          <button className="text-blue-500 underline" disabled>
            Sign up (coming soon)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

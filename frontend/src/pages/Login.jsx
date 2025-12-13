import React from 'react';

/**
 * Login Page
 * - User authentication interface
 * - Email/password login form
 * - Placeholder for future implementation
 */
const Login = ({ isDark }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement login logic
    console.log('Login attempt:', { email, password });
    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1
            className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Aira
          </h1>
          <p
            className={`text-sm mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Your Mental Health Companion
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors duration-200 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-400'
              }`}
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors duration-200 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-400'
              }`}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-medium transition-all duration-200 ${
              loading
                ? isDark
                  ? 'bg-gray-600 text-gray-400'
                  : 'bg-gray-400 text-gray-200'
                : isDark
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p
          className={`text-center text-sm mt-6 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Don't have an account?{' '}
          <a
            href="#signup"
            className="text-blue-500 hover:underline font-medium"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

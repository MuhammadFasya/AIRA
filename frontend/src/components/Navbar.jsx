import React, { useState } from 'react';
import { Sun, Moon, Menu } from 'lucide-react';

/**
 * Navbar Component
 * - Displays Aira logo and theme toggle
 * - Sticky top positioning
 * - Mobile responsive with hamburger menu support
 */
const Navbar = ({ isDark, setIsDark, onMenuToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuToggle?.();
  };

  return (
    <nav
      className={`sticky top-0 z-40 w-full transition-colors duration-300 ${
        isDark
          ? 'bg-gray-900 border-gray-800'
          : 'bg-white border-gray-200'
      } border-b shadow-sm`}
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span
            className={`font-bold text-xl ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Aira
          </span>
        </div>

        {/* Center - App Title (Desktop Only) */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <span
            className={`text-sm font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Your Mental Health Companion
          </span>
        </div>

        {/* Right Section - Theme Toggle & Menu */}
        <div className="flex items-center gap-3 justify-end">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            aria-label="Toggle theme"
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMenuClick}
            className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

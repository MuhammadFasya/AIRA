import React from "react";

/**
 * Minimal Navbar for Aira
 * Left: logo + text
 * Right: theme toggle with asset icon
 */
const Navbar = ({ isDark, setIsDark, logoSrc, sidebarOpen = false }) => {
  const toggleTheme = () => setIsDark(!isDark);

  const themeFolder = isDark ? "Dark Mode" : "Light Mode";
  const themeIconSrc = encodeURI(
    `/assets/${themeFolder}/${isDark ? "Theme - Dark.svg" : "theme-lightButton.svg"}`
  );

  return (
    <nav
      className={`sticky top-0 z-40 w-full transition-colors duration-300 ${
        isDark ? "bg-gray-900 border-gray-800" : "bg-[#F9FEFF] border-gray-200"
      } border-b shadow-sm`}
    >
      <div className="flex items-center h-16 px-4 md:px-6">
        {/* Left: logo */}
        <div
          className={`flex items-center gap-3 transition-all duration-500 ease-in-out ${sidebarOpen ? "ml-64" : "ml-20"}`}
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Aira logo"
              className="w-8 h-8 object-contain rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
          )}

          <span
            className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Aira
          </span>
        </div>

        {/* Right: theme toggle */}
        <div className="ml-auto">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors duration-200 ${
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

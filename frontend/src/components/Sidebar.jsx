import React from "react";

/**
 * Sidebar Component - Expandable vertical navigation
 * - Toggles between icon-only (collapsed) and icon+text (expanded)
 * - Icon buttons: Sidebar toggle, New Chat, Search, History, Settings
 * - Smooth expand/collapse animation
 */
const Sidebar = ({
  isDark,
  onNewChat,
  onSettings,
  isOpen,
  onToggle,
  onSearch,
  onHistory,
}) => {
  const themeFolder = isDark ? "Dark Mode" : "Light Mode";
  const asset = (filename) => encodeURI(`/assets/${themeFolder}/${filename}`);

  // Toggle button changes based on isOpen state
  const toggleIconSrc = asset(
    isOpen
      ? isDark
        ? "Moved - darkSidebar.svg"
        : "moved-lightSidebar.png"
      : isDark
        ? "Idle - darkSidebar.svg"
        : "idle-lightSidebar.png"
  );

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 flex flex-col py-4 gap-4 z-30 transition-all duration-500 ease-in-out ${
        isDark ? "bg-gray-900" : "bg-[#F9FEFF]"
      } ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggle}
        className={`mx-4 h-12 rounded-full flex items-center gap-3 transition-all duration-500 ease-in-out ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-white hover:bg-gray-100 shadow-sm"
        } ${isOpen ? "px-4" : "justify-center"}`}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        <img
          src={toggleIconSrc}
          alt="toggle"
          className="w-6 h-6 object-contain flex-shrink-0 transition-transform duration-500 ease-in-out"
        />
        {isOpen && (
          <span
            className={`text-sm font-medium whitespace-nowrap transition-opacity duration-500 ease-in-out ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Menu
          </span>
        )}
      </button>

      {/* New Chat Button */}
      <button
        onClick={() => onNewChat && onNewChat()}
        className={`mx-4 h-12 rounded-full flex items-center gap-3 transition-all duration-500 ease-in-out ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-white hover:bg-gray-100 shadow-sm"
        } ${isOpen ? "px-4" : "justify-center"}`}
        aria-label="New chat"
        title="New chat"
      >
        <img
          src={asset(isDark ? "Newchat - Dark.svg" : "newChat-Light.png")}
          alt="new chat"
          className="w-6 h-6 object-contain flex-shrink-0"
        />
        {isOpen && (
          <span
            className={`text-sm font-medium whitespace-nowrap transition-opacity duration-500 ease-in-out ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            New Chat
          </span>
        )}
      </button>

      {/* Search Button */}
      <button
        onClick={() => onSearch && onSearch()}
        className={`mx-4 h-12 rounded-full flex items-center gap-3 transition-all duration-500 ease-in-out ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-white hover:bg-gray-100 shadow-sm"
        } ${isOpen ? "px-4" : "justify-center"}`}
        aria-label="Search"
        title="Search"
      >
        <img
          src={asset(isDark ? "Search - Dark.svg" : "Search-Light.png")}
          alt="search"
          className="w-6 h-6 object-contain flex-shrink-0"
        />
        {isOpen && (
          <span
            className={`text-sm font-medium whitespace-nowrap transition-opacity duration-500 ease-in-out ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Search
          </span>
        )}
      </button>

      {/* History Button */}
      <button
        onClick={() => onHistory && onHistory()}
        className={`mx-4 h-12 rounded-full flex items-center gap-3 transition-all duration-500 ease-in-out ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-white hover:bg-gray-100 shadow-sm"
        } ${isOpen ? "px-4" : "justify-center"}`}
        aria-label="History"
        title="History"
      >
        <img
          src={asset(isDark ? "History - Dark.svg" : "history-Light.png")}
          alt="history"
          className="w-6 h-6 object-contain flex-shrink-0"
        />
        {isOpen && (
          <span
            className={`text-sm font-medium whitespace-nowrap transition-opacity duration-500 ease-in-out ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            History
          </span>
        )}
      </button>

      {/* Spacer to push bottom buttons down */}
      <div className="flex-1" />

      {/* Settings Button */}
      <button
        onClick={() => onSettings && onSettings()}
        className={`mx-4 h-12 rounded-full flex items-center gap-3 transition-all duration-500 ease-in-out ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-white hover:bg-gray-100 shadow-sm"
        } ${isOpen ? "px-4" : "justify-center"}`}
        aria-label="Settings"
        title="Settings"
      >
        <img
          src={asset(isDark ? "Setting - Dark.svg" : "setting-Light.png")}
          alt="settings"
          className="w-6 h-6 object-contain flex-shrink-0"
        />
        {isOpen && (
          <span
            className={`text-sm font-medium whitespace-nowrap transition-opacity duration-500 ease-in-out ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Settings
          </span>
        )}
      </button>
    </aside>
  );
};

export default Sidebar;

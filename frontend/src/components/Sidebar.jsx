import React from 'react';
import { Plus, Search, History, Settings, User, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Sidebar Component
 * - Collapsible left navigation panel
 * - Contains: New Chat, Search, History, User Profile, Settings
 * - Smooth sliding animation on toggle
 * - Dark/Light theme support
 */
const Sidebar = ({
  isOpen,
  onToggle,
  isDark,
  onNewChat,
  onSettings,
  chatHistory = []
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 transition-transform duration-300 ease-in-out z-40 ${
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        } border-r overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={onNewChat}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Search Section */}
        <div className="p-4 border-b border-gray-700">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isDark
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-gray-100 border border-gray-300'
            }`}
          >
            <Search size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
            <input
              type="text"
              placeholder="Search chats..."
              className={`flex-1 bg-transparent outline-none text-sm ${
                isDark
                  ? 'placeholder-gray-600 text-white'
                  : 'placeholder-gray-500 text-gray-900'
              }`}
            />
          </div>
        </div>

        {/* History Section */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <History size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Recent Chats
            </span>
          </div>

          {chatHistory.length > 0 ? (
            <ul className="space-y-2">
              {chatHistory.slice(0, 5).map((chat, index) => (
                <li key={index}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors duration-200 ${
                      isDark
                        ? 'hover:bg-gray-800 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {chat}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p
              className={`text-xs ${
                isDark ? 'text-gray-600' : 'text-gray-500'
              }`}
            >
              No chat history yet
            </p>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          {/* User Profile Button */}
          <button
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
              isDark
                ? 'hover:bg-gray-800 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <User size={18} />
            <span className="text-sm font-medium">Profile</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onSettings}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
              isDark
                ? 'hover:bg-gray-800 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Toggle Button (Desktop only, when closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className={`fixed left-16 top-20 z-50 p-1 rounded-r-lg transition-colors duration-200 hidden md:block ${
            isDark
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
          }`}
          aria-label="Open sidebar"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </>
  );
};

export default Sidebar;

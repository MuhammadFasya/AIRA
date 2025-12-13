import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * Settings Modal/Page
 * - User preferences configuration
 * - Theme settings, avatar selection, chat history management
 * - Modal overlay with backdrop blur
 */
const Settings = ({ isDark, setIsDark, isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    theme: isDark ? 'dark' : 'light',
    avatar: 'default',
    fontSize: 'medium',
    notifications: true,
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));

    // Apply theme change immediately
    if (key === 'theme') {
      setIsDark(value === 'dark');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      // TODO: Implement clear history logic
      console.log('Chat history cleared');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Blur */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-lg shadow-2xl overflow-hidden ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <h2
            className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Settings
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors duration-200 ${
              isDark
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Theme Setting */}
          <div>
            <label
              className={`block text-sm font-semibold mb-3 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Theme
            </label>
            <div className="flex gap-3">
              {['light', 'dark'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleSettingChange('theme', theme)}
                  className={`flex-1 py-2 px-3 rounded-lg capitalize font-medium transition-all duration-200 ${
                    settings.theme === theme
                      ? 'bg-blue-500 text-white'
                      : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Avatar Setting */}
          <div>
            <label
              className={`block text-sm font-semibold mb-3 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Avatar
            </label>
            <select
              value={settings.avatar}
              onChange={(e) => handleSettingChange('avatar', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors duration-200 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="default">Default (Blue)</option>
              <option value="purple">Purple</option>
              <option value="pink">Pink</option>
              <option value="green">Green</option>
            </select>
          </div>

          {/* Font Size Setting */}
          <div>
            <label
              className={`block text-sm font-semibold mb-3 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Font Size
            </label>
            <div className="flex gap-3">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => handleSettingChange('fontSize', size)}
                  className={`flex-1 py-2 px-3 rounded-lg capitalize font-medium text-sm transition-all duration-200 ${
                    settings.fontSize === size
                      ? 'bg-blue-500 text-white'
                      : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications Setting */}
          <div className="flex items-center justify-between">
            <label
              className={`text-sm font-semibold ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Notifications
            </label>
            <button
              onClick={() =>
                handleSettingChange('notifications', !settings.notifications)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                settings.notifications
                  ? 'bg-blue-500'
                  : isDark
                  ? 'bg-gray-700'
                  : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Divider */}
          <div
            className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
          />

          {/* Clear History Button */}
          <button
            onClick={handleClearHistory}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              isDark
                ? 'bg-red-900 hover:bg-red-800 text-red-100'
                : 'bg-red-100 hover:bg-red-200 text-red-700'
            }`}
          >
            Clear Chat History
          </button>
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <button
            onClick={onClose}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

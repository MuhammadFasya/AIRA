import React, { useState } from "react";
import { X, Search } from "lucide-react";

/**
 * SearchModal Component
 * - Search through chat messages
 * - Filter by keywords
 * - Click to jump to message
 */
const SearchModal = ({ isOpen, onClose, messages, isDark }) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Filter messages based on search query
  const filteredMessages = messages.filter((msg) =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        className={`w-full max-w-2xl mx-4 rounded-2xl shadow-2xl ${
          isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <h2 className="text-2xl font-bold">Search Messages</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-full ${
              isDark ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Type to search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`flex-1 bg-transparent outline-none ${
                isDark ? "text-white" : "text-gray-900"
              }`}
              autoFocus
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="px-6 pb-6 max-h-96 overflow-y-auto">
          {searchQuery.trim() === "" ? (
            <p className="text-center text-gray-400 py-8">
              Start typing to search through your messages
            </p>
          ) : filteredMessages.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              No messages found matching "{searchQuery}"
            </p>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl transition-colors ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-750"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-purple-600 text-white"
                      }`}
                    >
                      {msg.sender === "user" ? "You" : "Aira"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex justify-end p-6 border-t ${
            isDark ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

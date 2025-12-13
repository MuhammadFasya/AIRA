import React, { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";

/**
 * ChatArea Component
 * - Displays conversation history
 * - User messages: right-aligned, light background
 * - Aira messages: left-aligned, blue background
 * - Auto-scrolls to the latest message
 * - Responsive message bubbles
 */
const ChatArea = ({ messages = [], isDark, isLoading = false }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      className={`flex-1 overflow-y-auto transition-colors duration-300 ${
        isDark ? "bg-gray-800" : "bg-gray-50"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Welcome State - No messages */}
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} className="text-white" />
              </div>
              <h2
                className={`text-xl font-semibold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Start a conversation
              </h2>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Share what's on your mind, and I'll listen
              </p>
            </div>
          </div>
        )}

        {/* Messages List */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* Avatar on the left for Aira, on the right for user */}
            {msg.sender === "aira" && (
              <div className="flex-shrink-0">
                {/* Theme-aware Aira avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? "bg-gray-700" : "bg-blue-100"}`}
                >
                  {/* simple emoji/icon for now */}
                  <span
                    className={`${isDark ? "text-white" : "text-blue-700"} text-lg`}
                  >
                    🤖
                  </span>
                </div>
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg transition-colors duration-200 ${
                msg.sender === "user"
                  ? isDark
                    ? "bg-blue-600 text-white rounded-br-none flex items-end"
                    : "bg-blue-500 text-white rounded-br-none flex items-end"
                  : isDark
                    ? "bg-gray-700 text-gray-100 rounded-bl-none"
                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
              }`}
            >
              <p className="text-sm md:text-base leading-relaxed">
                {msg.content}
              </p>

              {/* Timestamp (optional) */}
              <p
                className={`text-xs mt-1 ${
                  msg.sender === "user"
                    ? "text-blue-100"
                    : isDark
                      ? "text-gray-500"
                      : "text-gray-400"
                }`}
              >
                {msg.timestamp}
              </p>
            </div>

            {msg.sender === "user" && (
              <div className="flex-shrink-0">
                {/* user avatar or initials */}
                {msg.avatar ? (
                  <img
                    src={msg.avatar}
                    alt="user avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-200">
                    U
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className={`px-4 py-3 rounded-lg rounded-bl-none ${
                isDark ? "bg-gray-700" : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex gap-2">
                <div
                  className={`w-2 h-2 rounded-full animate-bounce ${
                    isDark ? "bg-gray-500" : "bg-gray-400"
                  }`}
                />
                <div
                  className={`w-2 h-2 rounded-full animate-bounce ${
                    isDark ? "bg-gray-500" : "bg-gray-400"
                  }`}
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className={`w-2 h-2 rounded-full animate-bounce ${
                    isDark ? "bg-gray-500" : "bg-gray-400"
                  }`}
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatArea;

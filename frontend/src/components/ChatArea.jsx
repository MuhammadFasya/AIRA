import React, { useEffect, useRef } from "react";

/**
 * ChatArea Component
 * - Displays conversation with cloud-style bubbles
 * - User messages: right-aligned with rounded cloud shape
 * - Aira messages: left-aligned with AI avatar and rounded cloud shape
 * - Auto-scrolls to the latest message
 */
const ChatArea = ({ messages = [], isDark, isLoading = false }) => {
  const messagesEndRef = useRef(null);

  const themeFolder = isDark ? "Dark Mode" : "Light Mode";
  const aiAvatarSrc = encodeURI(
    `/assets/${themeFolder}/${isDark ? "aiAvatar - Darkbackground.png" : "aiAvatar - Light.png"}`
  );

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Messages List */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* AI Avatar on the left */}
            {msg.sender === "aira" && (
              <div className="flex-shrink-0 mb-1">
                <img
                  src={aiAvatarSrc}
                  alt="Aira"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            )}

            {/* Message Bubble - Cloud Style */}
            <div
              className={`relative max-w-xs md:max-w-md lg:max-w-lg px-5 py-3 shadow-sm ${
                msg.sender === "user"
                  ? isDark
                    ? "bg-blue-600 text-white rounded-3xl rounded-br-md"
                    : "bg-blue-500 text-white rounded-3xl rounded-br-md"
                  : isDark
                    ? "bg-gray-800 text-gray-100 rounded-3xl rounded-bl-md"
                    : "bg-white text-gray-900 rounded-3xl rounded-bl-md border border-gray-200"
              }`}
            >
              <p className="text-sm md:text-base leading-relaxed break-words">
                {msg.content}
              </p>

              {/* Timestamp */}
              {msg.timestamp && (
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
              )}
            </div>

            {/* User Avatar placeholder (optional) */}
            {msg.sender === "user" && msg.avatar && (
              <div className="flex-shrink-0 mb-1">
                <img
                  src={msg.avatar}
                  alt="You"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-end gap-3 justify-start">
            <div className="flex-shrink-0 mb-1">
              <img
                src={aiAvatarSrc}
                alt="Aira"
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
            <div
              className={`px-5 py-3 rounded-3xl rounded-bl-md ${
                isDark ? "bg-gray-800" : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${isDark ? "bg-gray-600" : "bg-gray-400"} animate-bounce`}
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className={`w-2 h-2 rounded-full ${isDark ? "bg-gray-600" : "bg-gray-400"} animate-bounce`}
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className={`w-2 h-2 rounded-full ${isDark ? "bg-gray-600" : "bg-gray-400"} animate-bounce`}
                  style={{ animationDelay: "300ms" }}
                ></div>
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

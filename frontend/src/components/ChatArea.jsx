import React, { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

/**
 * ChatArea Component
 * - Displays conversation with cloud-style bubbles
 * - User messages: right-aligned with rounded cloud shape
 * - Aira messages: left-aligned with AI avatar and rounded cloud shape
 * - Auto-scrolls to the latest message
 */
const ChatArea = ({ messages = [], isDark, isLoading = false }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const themeFolder = isDark ? "Dark Mode" : "Light Mode";
  const aiAvatarSrc = encodeURI(
    `/assets/${themeFolder}/${isDark ? "aiAvatar - Darkbackground.png" : "aiAvatar - Light.png"}`
  );

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check if user has scrolled up
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto relative"
      ref={containerRef}
      onScroll={handleScroll}
    >
      <div className="px-6 md:px-8 lg:px-12 py-6 space-y-4">
        {/* Messages List */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
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
              className={`relative max-w-[75%] md:max-w-[65%] lg:max-w-[60%] px-5 py-3 shadow-sm ${
                msg.sender === "user"
                  ? isDark
                    ? "bg-blue-600 text-white rounded-3xl rounded-br-md"
                    : "bg-blue-500 text-white rounded-3xl rounded-br-md"
                  : isDark
                    ? "bg-gray-800 text-gray-100 rounded-3xl rounded-bl-md"
                    : "bg-white text-gray-900 rounded-3xl rounded-bl-md border border-gray-200"
              }`}
            >
              <p className="text-sm md:text-base leading-relaxed break-words text-justify">
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
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Aira is typing
                </span>
                <div className="flex gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${isDark ? "bg-blue-500" : "bg-blue-600"} animate-bounce`}
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full ${isDark ? "bg-blue-500" : "bg-blue-600"} animate-bounce`}
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full ${isDark ? "bg-blue-500" : "bg-blue-600"} animate-bounce`}
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className={`fixed bottom-24 right-8 p-3 rounded-full shadow-lg transition-all duration-300 ${
            isDark
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white z-20`}
          aria-label="Scroll to bottom"
        >
          <ArrowDown size={20} />
        </button>
      )}
    </div>
  );
};

export default ChatArea;

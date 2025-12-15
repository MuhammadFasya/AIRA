import React, { useState, useRef } from "react";

const ChatInput = ({
  onSendMessage,
  isDark,
  isLoading = false,
  isCentered = false,
}) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const themeFolder = isDark ? "Dark Mode" : "Light Mode";
  const sendIconSrc = encodeURI(
    `/assets/${themeFolder}/${isDark ? "Send - Dark.svg" : "send-Light.png"}`
  );

  const handleSendMessage = () => {
    if (message.trim() === "" || isLoading) return;
    onSendMessage(message);
    setMessage("");
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Say Something.."
          disabled={isLoading}
          className={`flex-1 px-4 py-3 rounded-full outline-none transition-colors duration-200 ${
            isDark
              ? "bg-gray-800 text-white placeholder-gray-500 border border-gray-700"
              : "bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300"
          } disabled:opacity-50`}
        />
        <button
          onClick={handleSendMessage}
          disabled={message.trim() === "" || isLoading}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Send message"
        >
          <img
            src={sendIconSrc}
            alt="send"
            className="w-full h-full object-contain"
          />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';

/**
 * ChatInput Component
 * - Auto-expandable textarea
 * - Send button with loading state
 * - Keyboard shortcut support (Shift+Enter = new line, Enter = send)
 * - Responsive design
 */
const ChatInput = ({ onSendMessage, isDark, isLoading = false }) => {
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState(2);
  const textareaRef = useRef(null);

  // Auto-expand textarea based on content
  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Calculate rows based on content
    const lineCount = value.split('\n').length;
    setRows(Math.min(Math.max(lineCount, 2), 5));
  };

  // Handle message submission
  const handleSendMessage = () => {
    if (message.trim() === '' || isLoading) return;

    onSendMessage(message);
    setMessage('');
    setRows(2);

    // Focus textarea after sending
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Handle keyboard events
  const handleKeyDown = (e) => {
    // Send on Enter, unless Shift is held (Shift+Enter = new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`border-t transition-colors duration-300 ${
        isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      } p-4 md:p-6`}
    >
      <div className="max-w-4xl mx-auto flex gap-3">
        {/* Input Field Container */}
        <div className="flex-1">
          <div
            className={`rounded-lg border transition-colors duration-200 ${
              isDark
                ? 'bg-gray-800 border-gray-700 focus-within:border-blue-500'
                : 'bg-white border-gray-300 focus-within:border-blue-400'
            }`}
          >
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Share what's on your mind..."
              rows={rows}
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-lg resize-none outline-none transition-colors duration-200 ${
                isDark
                  ? 'bg-gray-800 text-white placeholder-gray-600'
                  : 'bg-white text-gray-900 placeholder-gray-500'
              } disabled:opacity-50`}
            />
          </div>

          {/* Help Text */}
          <p
            className={`text-xs mt-1 ${
              isDark ? 'text-gray-600' : 'text-gray-500'
            }`}
          >
            <span>Press </span>
            <kbd className={`px-1 py-0.5 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              Enter
            </kbd>
            <span> to send, </span>
            <kbd className={`px-1 py-0.5 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              Shift + Enter
            </kbd>
            <span> for new line</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 justify-end">
          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={isLoading || message.trim() === ''}
            className={`p-3 rounded-lg transition-all duration-200 flex items-center justify-center ${
              isLoading || message.trim() === ''
                ? isDark
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isDark
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            title="Send message"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>

          {/* Optional: Mic Button for future voice support */}
          <button
            className={`p-3 rounded-lg transition-colors duration-200 flex items-center justify-center ${
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
            }`}
            title="Voice input (coming soon)"
            disabled
          >
            <Mic size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

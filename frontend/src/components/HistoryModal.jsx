import React from "react";
import { X, MessageSquare } from "lucide-react";

/**
 * HistoryModal Component
 * - Shows chat history from current session
 * - For MVP: displays recent chat topics
 * - Future: Load from database
 */
const HistoryModal = ({
  isOpen,
  onClose,
  chatHistory,
  isDark,
  onSelectChat,
}) => {
  if (!isOpen) return null;

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
          <h2 className="text-2xl font-bold">Chat History</h2>
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

        {/* History List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {chatHistory.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">No chat history yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Start a conversation to see your history here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatHistory.map((chat, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (onSelectChat) onSelectChat(chat);
                    onClose();
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-colors ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-750"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare
                      size={20}
                      className="text-blue-500 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{chat}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Recent conversation
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex justify-between items-center p-6 border-t ${
            isDark ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <p className="text-sm text-gray-400">
            {chatHistory.length}{" "}
            {chatHistory.length === 1 ? "conversation" : "conversations"} in
            this session
          </p>
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

export default HistoryModal;

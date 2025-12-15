import React, { useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";

/**
 * Toast Notification Component
 * - Shows user-friendly notifications
 * - Auto-dismisses after timeout
 * - Types: success, error, info
 */
const Toast = ({ message, type = "info", onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <AlertCircle size={20} className="text-red-500" />,
    info: <Info size={20} className="text-blue-500" />,
  };

  const bgColors = {
    success:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  };

  return (
    <div
      className={`fixed top-20 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg border ${bgColors[type]} 
        animate-in slide-in-from-top-5 duration-300`}
    >
      <div className="flex items-start gap-3">
        {icons[type]}
        <p className="flex-1 text-sm text-gray-900 dark:text-white">
          {message}
        </p>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;

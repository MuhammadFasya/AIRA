import React from "react";

/**
 * LoadingScreen
 * Simple splash / loading screen that shows the app logo and a subtle
 * animation. This is shown before the login/signup flow or initial app
 * bootstrap completes.
 */
const LoadingScreen = ({ logoSrc, title = "Aira", theme = "light", bgSrc }) => {
  const style = bgSrc
    ? {
        backgroundImage: `url(${bgSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={style}
    >
      <div className="text-center">
        <div
          className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-4 shadow-lg transition-colors duration-200 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Aira logo"
              className="w-20 h-20 object-contain"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-12 h-12 ${theme === "dark" ? "text-white" : "text-blue-600"}`}
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.7 9.3c.39-.39 1.02-.39 1.41 0L12 12.17l2.89-2.87c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41L13.41 13.6c-.39.39-1.02.39-1.41 0L7.7 10.7c-.39-.39-.39-1.02 0-1.41z" />
            </svg>
          )}
        </div>

        <h1
          className={`text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          {title}
        </h1>
        <p
          className={`mt-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          Connecting you to Aira…
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;

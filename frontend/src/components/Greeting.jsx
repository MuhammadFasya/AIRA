import React, { useState, useEffect } from "react";

/**
 * Greeting Component
 * - Displays random greeting messages
 * - Shows current time and user-friendly message
 * - Rotates between predefined empathetic greetings
 */
const Greeting = ({ isDark, userName }) => {
  const greetings = [
    "How's your day?",
    "Hello there!",
    "Hope you're feeling okay today.",
    "What's on your mind?",
    "I'm here to listen.",
    "Take a deep breath.",
    "You matter.",
  ];

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Pick a random greeting
    const randomGreeting =
      greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
  }, []);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center py-8 md:py-12">
        <h1
          className={`text-3xl md:text-4xl font-bold mb-3 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {getTimeGreeting()}
          {userName ? `, ${userName}` : ""}
        </h1>

        <p
          className={`text-lg md:text-xl font-medium ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {greeting}
        </p>

        <div className="mt-6 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div
            className={`w-2 h-2 rounded-full ${
              isDark ? "bg-gray-700" : "bg-gray-300"
            }`}
          />
          <div
            className={`w-2 h-2 rounded-full ${
              isDark ? "bg-gray-700" : "bg-gray-300"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default Greeting;

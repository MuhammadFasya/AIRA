import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import ChatInput from "../components/ChatInput";
import Greeting from "../components/Greeting";
import axios from "axios";

/**
 * Home Page
 * - Main chat interface layout
 * - Manages chat state and message flow
 * - Handles communication with Flask backend
 * - Responsive grid layout with sidebar
 */
const Home = ({
  isDark,
  user,
  sidebarOpen,
  onToggleSidebar,
  onOpenSettings,
}) => {
  const [messages, setMessages] = useState([]);
  // Simulated current user profile (replace with real auth later)
  const themeFolder = isDark ? "Dark Mode" : "Light Mode";
  const avatarDefault = encodeURI(
    `/assets/${themeFolder}/${isDark ? "aiAvatar - Darkbackground.png" : "aiAvatar - Light.png"}`
  );

  const [userProfile] = useState({
    name: user?.name || "You",
    avatar: user?.avatar || avatarDefault, // theme-aware default avatar
  });

  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // API Base URL - Change this to your Flask backend URL
  const API_BASE_URL = "http://localhost:5000";

  /**
   * Send message to backend and get response
   * @param {string} userMessage - The message from the user
   */
  const handleSendMessage = async (userMessage) => {
    // Add user message to chat
    const userMsg = {
      sender: "user",
      content: userMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: userProfile.avatar,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Send message to Flask backend
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: userMessage,
      });

      const { response: aiResponse, sentiment, history_length } = response.data;

      // Add Aira's response to chat
      const airaMsg = {
        sender: "aira",
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sentiment,
        avatar: null, // theme-aware avatar rendered in ChatArea
      };

      setMessages((prev) => [...prev, airaMsg]);

      // Update chat history
      if (userMessage.length > 30) {
        setChatHistory((prev) => [
          userMessage.substring(0, 30) + "...",
          ...prev,
        ]);
      } else {
        setChatHistory((prev) => [userMessage, ...prev]);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Error response from Aira
      const errorMsg = {
        sender: "aira",
        content:
          "Sorry, I encountered an error. Please make sure the backend is running and try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset chat history
   */
  const handleNewChat = async () => {
    try {
      await axios.post(`${API_BASE_URL}/reset`);
      setMessages([]);
    } catch (error) {
      console.error("Error resetting chat:", error);
      setMessages([]);
    }
  };

  // Background image path based on theme
  const backgroundImagePath = encodeURI(
    `/assets/${themeFolder}/${isDark ? "Home - DarkBackground.svg" : "Home-LightBackground.svg"}`
  );

  return (
    <div className="flex h-[calc(100vh-64px)] relative">
      {/* Sidebar */}
      <Sidebar
        isDark={isDark}
        onNewChat={handleNewChat}
        onSettings={onOpenSettings}
        isOpen={sidebarOpen}
        onToggle={onToggleSidebar}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col relative transition-all duration-500 ease-in-out ${sidebarOpen ? "ml-64" : "ml-20"}`}
      >
        {/* Background Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${backgroundImagePath}')` }}
        />

        {/* Greeting or Chat Area */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
            <div className="w-full max-w-4xl">
              <Greeting isDark={isDark} userName={userProfile.name} />
              <div className="mt-8">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isDark={isDark}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <ChatArea
              messages={messages}
              isDark={isDark}
              isLoading={isLoading}
            />
            {/* Chat Input - Always at bottom with background */}
            <ChatInput
              onSendMessage={handleSendMessage}
              isDark={isDark}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

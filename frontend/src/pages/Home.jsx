import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import ChatInput from "../components/ChatInput";
import Greeting from "../components/Greeting";
import SearchModal from "../components/SearchModal";
import HistoryModal from "../components/HistoryModal";
import Toast from "../components/Toast";
import axiosClient from "../api/axiosClient";

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
  language = "en",
}) => {
  const [messages, setMessages] = useState([]);
  const themeFolder = isDark ? "Dark Mode" : "Light Mode";
  const avatarDefault = encodeURI(
    `/assets/${themeFolder}/${isDark ? "aiAvatar - Darkbackground.png" : "aiAvatar - Light.png"}`
  );

  // Get user avatar - use uploaded profile picture if available
  const getUserAvatar = () => {
    if (user?.profilePicture) {
      return user.profilePicture;
    }
    if (user?.avatar) {
      return user.avatar;
    }
    return avatarDefault;
  };

  const [userProfile, setUserProfile] = useState({
    name: user?.name || "You",
    avatar: getUserAvatar(),
  });

  // Update user profile when user data changes (e.g., after profile update)
  useEffect(() => {
    setUserProfile({
      name: user?.name || "You",
      avatar: getUserAvatar(),
    });
  }, [user, isDark]);

  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

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
      const response = await axiosClient.post("/chat", {
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

      // Show user-friendly error toast
      if (error.response) {
        // Server responded with error
        showToast(
          error.response.data?.error ||
            "Failed to send message. Please try again.",
          "error"
        );
      } else if (error.request) {
        // No response from server
        showToast(
          "Cannot connect to server. Please check your connection and make sure the backend is running.",
          "error"
        );
      } else {
        // Other errors
        showToast("An unexpected error occurred. Please try again.", "error");
      }

      // Error response from Aira (still show in chat for context)
      const errorMsg = {
        sender: "aira",
        content:
          "Sorry, I encountered an error. Please try again or check your connection.",
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
      await axiosClient.post("/reset");
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
        onSearch={() => setSearchModalOpen(true)}
        onHistory={() => setHistoryModalOpen(true)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col relative overflow-y-auto transition-all duration-500 ease-in-out ${sidebarOpen ? "ml-64" : "ml-20"}`}
        style={{
          backgroundImage: `url('${backgroundImagePath}')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat-y",
        }}
      >
        {/* Greeting or Chat Area */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
            <div className="w-full max-w-4xl">
              <Greeting
                isDark={isDark}
                userName={userProfile.name}
                language={language}
              />
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
            <div className="flex-1 relative z-10">
              <ChatArea
                messages={messages}
                isDark={isDark}
                isLoading={isLoading}
              />
            </div>
            {/* Chat Input - Always at bottom with background */}
            <div className="relative z-10">
              <ChatInput
                onSendMessage={handleSendMessage}
                isDark={isDark}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        messages={messages}
        isDark={isDark}
      />
      <HistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        chatHistory={chatHistory}
        isDark={isDark}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Home;

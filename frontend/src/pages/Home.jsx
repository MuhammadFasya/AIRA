import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import ChatInput from "../components/ChatInput";
import Greeting from "../components/Greeting";
import SearchModal from "../components/SearchModal";
import HistoryModal from "../components/HistoryModal";
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
        className={`flex-1 flex flex-col relative transition-all duration-500 ease-in-out ${sidebarOpen ? "ml-64" : "ml-20"}`}
        style={{
          backgroundImage: `url('${backgroundImagePath}')`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
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
    </div>
  );
};

export default Home;

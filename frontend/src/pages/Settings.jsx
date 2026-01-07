import React, { useState } from "react";
import toast from "react-hot-toast";
import { X, User, Globe, LogOut, Upload } from "lucide-react";
import { useTranslation } from "../utils/translations";

/**
 * Settings Modal
 * - Profile settings: email, username, profile picture, logout
 * - Language settings
 * - Theme settings
 */
const Settings = ({
  isDark,
  setIsDark,
  isOpen,
  onClose,
  user,
  onLogout,
  onUserUpdate,
  language: propLanguage,
  onLanguageChange,
}) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    username: user?.name || "",
    email: user?.email || "",
    profilePicture: user?.avatar || user?.profilePicture || null,
  });

  // Use language from props or fallback to localStorage
  const language =
    propLanguage || localStorage.getItem("aira_language") || "en";
  const { t } = useTranslation(language);

  const handleProfileChange = (key, value) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleProfileChange("profilePicture", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Save profile data to localStorage and update user object
    try {
      const updatedUser = {
        ...user,
        name: profileData.username,
        email: profileData.email,
        avatar: profileData.profilePicture,
        profilePicture: profileData.profilePicture,
      };
      localStorage.setItem("aira_user", JSON.stringify(updatedUser));

      // Update user in parent component if callback provided
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      console.log("Profile saved:", updatedUser);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const handleLanguageChange = (langCode) => {
    localStorage.setItem("aira_language", langCode);
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
    toast.success(
      `Language changed to ${langCode === "en" ? "English" : "Indonesian"}`
    );
    console.log("Language changed to:", langCode);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      toast.success("Logged out successfully!");
      onLogout && onLogout();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop Blur */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 sm:p-6 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2
            className={`text-lg sm:text-xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("settingsTitle")}
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors duration-200 ${
              isDark
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div
          className={`flex border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium transition-colors ${
              activeTab === "profile"
                ? isDark
                  ? "bg-gray-700 text-white border-b-2 border-blue-500"
                  : "bg-gray-100 text-gray-900 border-b-2 border-blue-500"
                : isDark
                  ? "text-gray-400 hover:bg-gray-750"
                  : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <User size={18} />
            {t("profileTab")}
          </button>
          <button
            onClick={() => setActiveTab("language")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
              activeTab === "language"
                ? isDark
                  ? "bg-gray-700 text-white border-b-2 border-blue-500"
                  : "bg-gray-100 text-gray-900 border-b-2 border-blue-500"
                : isDark
                  ? "text-gray-400 hover:bg-gray-750"
                  : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Globe size={18} />
            {t("languageTab")}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  {profileData.profilePicture ? (
                    <img
                      src={profileData.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-24 h-24 rounded-full flex items-center justify-center ${
                        isDark ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <User
                        size={40}
                        className={isDark ? "text-gray-400" : "text-gray-500"}
                      />
                    </div>
                  )}
                  <label
                    htmlFor="profile-upload"
                    className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-colors ${
                      isDark
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    <Upload size={16} className="text-white" />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Click to upload profile picture
                </p>
              </div>

              {/* Username */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Username
                </label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) =>
                    handleProfileChange("username", e.target.value)
                  }
                  className={`w-full px-4 py-2 rounded-lg outline-none transition-colors ${
                    isDark
                      ? "bg-gray-700 text-white border border-gray-600 focus:border-blue-500"
                      : "bg-gray-100 text-gray-900 border border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="Enter your username"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg outline-none transition-colors ${
                    isDark
                      ? "bg-gray-700 text-white border border-gray-600 focus:border-blue-500"
                      : "bg-gray-100 text-gray-900 border border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="Enter your email"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveProfile}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Save Changes
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isDark
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          )}

          {/* Language Settings */}
          {activeTab === "language" && (
            <div className="space-y-4">
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Select your preferred language
              </p>
              <div className="space-y-2">
                {[
                  { code: "en", name: "English" },
                  { code: "id", name: "Bahasa Indonesia" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      language === lang.code
                        ? isDark
                          ? "bg-blue-600 text-white"
                          : "bg-blue-500 text-white"
                        : isDark
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

// Simple translation system for AIRA
// Supported languages: English (en), Bahasa Indonesia (id)

export const translations = {
  en: {
    // Sidebar
    menu: "Menu",
    newChat: "New Chat",
    search: "Search",
    history: "History",
    settings: "Settings",

    // Greeting
    greetingTitle: "Hello, how can I help you today?",
    greetingSubtitle: "I'm here to listen and support you",

    // Chat Input
    placeholder: "Type your message...",

    // Search Modal
    searchTitle: "Search Messages",
    searchPlaceholder: "Type to search messages...",
    searchEmpty: "Start typing to search through your messages",
    searchNoResults: "No messages found matching",

    // History Modal
    historyTitle: "Chat History",
    historyEmpty: "No chat history yet",
    historySubtext: "Start a conversation to see your history here",
    historyRecent: "Recent conversation",
    historyCount: "conversations",
    historyCountSingle: "conversation",
    historySession: "in this session",

    // Settings Modal
    settingsTitle: "Settings",
    profileTab: "Profile",
    languageTab: "Language",
    profilePicture: "Profile Picture",
    changePicture: "Change Picture",
    username: "Username",
    email: "Email",
    saveChanges: "Save Changes",
    logout: "Logout",
    selectLanguage: "Select your preferred language",
    close: "Close",

    // Common
    you: "You",
    aira: "Aira",
  },

  id: {
    // Sidebar
    menu: "Menu",
    newChat: "Obrolan Baru",
    search: "Cari",
    history: "Riwayat",
    settings: "Pengaturan",

    // Greeting
    greetingTitle: "Halo, bagaimana saya bisa membantu Anda hari ini?",
    greetingSubtitle: "Saya di sini untuk mendengarkan dan mendukung Anda",

    // Chat Input
    placeholder: "Ketik pesan Anda...",

    // Search Modal
    searchTitle: "Cari Pesan",
    searchPlaceholder: "Ketik untuk mencari pesan...",
    searchEmpty: "Mulai mengetik untuk mencari pesan Anda",
    searchNoResults: "Tidak ada pesan yang cocok dengan",

    // History Modal
    historyTitle: "Riwayat Obrolan",
    historyEmpty: "Belum ada riwayat obrolan",
    historySubtext: "Mulai percakapan untuk melihat riwayat Anda di sini",
    historyRecent: "Percakapan terbaru",
    historyCount: "percakapan",
    historyCountSingle: "percakapan",
    historySession: "dalam sesi ini",

    // Settings Modal
    settingsTitle: "Pengaturan",
    profileTab: "Profil",
    languageTab: "Bahasa",
    profilePicture: "Foto Profil",
    changePicture: "Ubah Foto",
    username: "Nama Pengguna",
    email: "Email",
    saveChanges: "Simpan Perubahan",
    logout: "Keluar",
    selectLanguage: "Pilih bahasa yang Anda inginkan",
    close: "Tutup",

    // Common
    you: "Anda",
    aira: "Aira",
  },
};

// Get translation function
export const getTranslation = (key, lang = "en") => {
  return translations[lang]?.[key] || translations["en"][key] || key;
};

// Hook for using translations
export const useTranslation = (language = "en") => {
  const t = (key) => getTranslation(key, language);
  return { t };
};

/**
 * Token Utility Functions
 * Handles JWT token validation, expiration checking, and auto-logout
 */

/**
 * Decode JWT token (without verification - just to read expiration)
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;

    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode the payload (base64url)
    const payload = parts[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired, false if still valid
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();

  return currentTime >= expirationTime;
};

/**
 * Get token from localStorage
 * @returns {string|null} Token or null if not found
 */
export const getToken = () => {
  try {
    return localStorage.getItem("aira_token");
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

/**
 * Check if user is authenticated with valid token
 * @returns {boolean} True if authenticated with valid token
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  return !isTokenExpired(token);
};

/**
 * Clear all auth data from localStorage
 */
export const clearAuthData = () => {
  try {
    localStorage.removeItem("aira_token");
    localStorage.removeItem("aira_user");
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};

/**
 * Get time remaining until token expires (in minutes)
 * @param {string} token - JWT token
 * @returns {number} Minutes until expiration, or 0 if expired
 */
export const getTokenExpirationMinutes = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return 0;

  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  const remainingMs = expirationTime - currentTime;

  if (remainingMs <= 0) return 0;

  return Math.floor(remainingMs / 1000 / 60); // Convert to minutes
};

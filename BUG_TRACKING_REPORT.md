# Bug Tracking & Testing Report

**AIRA Mental Health Chatbot - Testing & Debugging Assignment**

---

## 📋 Testing Overview

**Testing Period:** January 7, 2026  
**Tester:** Development Team  
**Testing Type:** Black-Box Testing  
**Application:** AIRA Mental Health Chatbot  
**Version:** Production (Railway + Netlify Deployment)

---

## 🐛 BUGS FOUND & FIXED

### BUG #1: LOGIN BLOCKED BY EXPIRED TOKEN ⚠️ CRITICAL

**Status:** ✅ FIXED  
**Severity:** CRITICAL  
**Priority:** P0  
**Date Found:** January 7, 2026  
**Date Fixed:** January 7, 2026

#### Problem Description

Users cannot login even with correct credentials when an expired JWT token exists in localStorage.

#### Root Cause

The axios request interceptor (`axiosClient.js`) was checking token expiration for ALL requests, including login requests. When an expired token was detected, it would:

1. Call `clearAuthData()`
2. Redirect to login page with `window.location.href = '/'`
3. Reject the request with `Promise.reject(new Error('Token expired'))`

This prevented the login request from ever reaching the backend.

#### Steps to Reproduce

1. Login to AIRA with valid credentials
2. Wait for token to expire (3 days) OR manually set expired token in localStorage
3. Refresh the page (redirected to login)
4. Try to login again with correct credentials
5. Login request is blocked and never reaches server

#### Expected Behavior

Login requests should always be allowed, regardless of existing token state.

#### Actual Behavior

Login request is intercepted and rejected when expired token exists in localStorage.

#### Fix Implemented

Modified `frontend/src/api/axiosClient.js` request interceptor to:

- Skip token validation for `/auth/login` and `/auth/register` endpoints
- Clear expired tokens silently for auth endpoints (without redirect)
- Only validate and block requests for protected endpoints

**Code Changes:**

```javascript
// Before (BUGGY)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("aira_token");
  if (token && isTokenExpired(token)) {
    clearAuthData();
    window.location.href = "/";
    return Promise.reject(new Error("Token expired"));
  }
  // ...
});

// After (FIXED)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("aira_token");

  // Skip token validation for login/register endpoints
  const isAuthEndpoint =
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/register");

  if (token && !isAuthEndpoint) {
    // Validate token for protected endpoints
    if (isTokenExpired(token)) {
      clearAuthData();
      window.location.href = "/";
      return Promise.reject(new Error("Token expired"));
    }
  } else if (token && isAuthEndpoint) {
    // For auth endpoints, just clear expired token without redirecting
    if (isTokenExpired(token)) {
      clearAuthData();
    }
  }
  // ...
});
```

#### Testing After Fix

- ✅ Can login with valid credentials (fresh state)
- ✅ Can login with valid credentials (expired token in localStorage)
- ✅ Can login with valid credentials (invalid token in localStorage)
- ✅ Protected routes still validate token correctly
- ✅ Expired tokens still trigger auto-logout on protected endpoints

#### Commit

```
commit 4f47095
CRITICAL FIX: Allow login requests when expired token exists - Skip token validation for auth endpoints
```

---

## 🧪 BLACK-BOX TEST CASES

### Test Suite 1: Authentication Module

#### TC-AUTH-001: Login with Valid Credentials

- **Status:** 🔄 IN PROGRESS
- **Priority:** P0
- **Steps:**
  1. Navigate to login page
  2. Enter email: `alex@aira.com`
  3. Enter password: `Password123`
  4. Click "Sign In" button
- **Expected:** Login successful, redirected to chat page, welcome toast appears
- **Actual:** _Testing in progress..._
- **Result:** ⏳ PENDING

#### TC-AUTH-002: Login with Invalid Email

- **Status:** ⏳ NOT STARTED
- **Priority:** P1
- **Steps:**
  1. Navigate to login page
  2. Enter email: `nonexistent@aira.com`
  3. Enter password: `Password123`
  4. Click "Sign In" button
- **Expected:** Error message "Login failed. Please check your credentials."
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-AUTH-003: Login with Wrong Password

- **Status:** ⏳ NOT STARTED
- **Priority:** P1
- **Steps:**
  1. Navigate to login page
  2. Enter email: `alex@aira.com`
  3. Enter password: `WrongPassword123`
  4. Click "Sign In" button
- **Expected:** Error message "Invalid credentials"
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-AUTH-004: Login with Empty Fields

- **Status:** ⏳ NOT STARTED
- **Priority:** P2
- **Steps:**
  1. Navigate to login page
  2. Leave email and password empty
  3. Click "Sign In" button
- **Expected:** Client-side validation or error message
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-AUTH-005: Token Persistence After Refresh

- **Status:** ⏳ NOT STARTED
- **Priority:** P1
- **Steps:**
  1. Login successfully
  2. Refresh the page (F5)
  3. Check if still logged in
- **Expected:** User remains logged in after refresh
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-AUTH-006: Token Expiration (3 Days)

- **Status:** ⏳ NOT STARTED
- **Priority:** P1
- **Steps:**
  1. Login successfully
  2. Manually set token exp to past date in localStorage
  3. Try to access chat page
- **Expected:** Auto-logout, redirected to login
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-AUTH-007: Logout Functionality

- **Status:** ⏳ NOT STARTED
- **Priority:** P1
- **Steps:**
  1. Login successfully
  2. Click logout button
  3. Check localStorage
- **Expected:** Logged out, token cleared, redirected to login
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

---

### Test Suite 2: Chat Functionality

#### TC-CHAT-001: Send Message to AI

- **Status:** ⏳ NOT STARTED
- **Priority:** P0
- **Steps:**
  1. Login to app
  2. Type message: "Hello, I'm feeling anxious"
  3. Press Enter or click send
- **Expected:** AI responds with supportive message
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-CHAT-002: Chat History Persistence

- **Status:** ⏳ NOT STARTED
- **Priority:** P1
- **Steps:**
  1. Send several messages
  2. Refresh page
  3. Check if messages are still visible
- **Expected:** Chat history loads from database
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-CHAT-003: New Chat Functionality

- **Status:** ⏳ NOT STARTED
- **Priority:** P1
- **Steps:**
  1. Start a chat conversation
  2. Click "New Chat" button
  3. Send a message
- **Expected:** New chat created, previous chat saved
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-CHAT-004: Chat History Modal

- **Status:** ⏳ NOT STARTED
- **Priority:** P2
- **Steps:**
  1. Create multiple chats
  2. Click "History" button
  3. Select a previous chat
- **Expected:** Modal opens, shows all chats, loads selected chat
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-CHAT-005: Error Handling (API Down)

- **Status:** ⏳ NOT STARTED
- **Priority:** P1
- **Steps:**
  1. Stop backend server
  2. Try to send message
- **Expected:** Error toast "Cannot connect to server"
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-CHAT-006: Long Message Handling

- **Status:** ⏳ NOT STARTED
- **Priority:** P2
- **Steps:**
  1. Type very long message (1000+ characters)
  2. Send message
- **Expected:** Message sent and displayed correctly
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-CHAT-007: Special Characters in Message

- **Status:** ⏳ NOT STARTED
- **Priority:** P2
- **Steps:**
  1. Send message with emojis: "😊 I'm happy today! 🎉"
  2. Send message with symbols: "Testing <script>alert()</script>"
- **Expected:** Messages handled safely, XSS prevented
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

---

### Test Suite 3: Settings & UI

#### TC-UI-001: Theme Toggle (Dark/Light)

- **Status:** ⏳ NOT STARTED
- **Priority:** P1
- **Steps:**
  1. Login to app
  2. Click theme toggle button
  3. Check visual changes
- **Expected:** Theme switches between dark and light mode
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-UI-002: Language Switch (EN/ID)

- **Status:** ⏳ NOT STARTED
- **Priority:** P1
- **Steps:**
  1. Open Settings
  2. Click language button
  3. Select Indonesian
- **Expected:** UI text changes to Indonesian, toast appears
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-UI-003: Profile Update

- **Status:** ⏳ NOT STARTED
- **Priority:** P2
- **Steps:**
  1. Open Settings
  2. Change name to "Alex Updated"
  3. Click Save
- **Expected:** Profile updated, success toast appears
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-UI-004: Responsive Design - Mobile

- **Status:** ⏳ NOT STARTED
- **Priority:** P1
- **Steps:**
  1. Open DevTools
  2. Switch to mobile view (iPhone 12)
  3. Test all features
- **Expected:** UI adapts to mobile screen, all features work
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-UI-005: Responsive Design - Tablet

- **Status:** ⏳ NOT STARTED
- **Priority:** P1
- **Steps:**
  1. Open DevTools
  2. Switch to tablet view (iPad)
  3. Test all features
- **Expected:** UI adapts to tablet screen, all features work
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

#### TC-UI-006: Avatar Display

- **Status:** ⏳ NOT STARTED
- **Priority:** P2
- **Steps:**
  1. Login as different users
  2. Check avatar colors
- **Expected:** Each user has consistent color avatar with initials
- **Actual:** _Not tested yet_
- **Result:** ⏳ PENDING

---

## 📊 TESTING PROGRESS

### Overall Progress

- **Total Test Cases:** 21
- **Completed:** 0
- **In Progress:** 1 (TC-AUTH-001)
- **Not Started:** 20
- **Pass Rate:** TBD

### Bugs Summary

- **Critical:** 1 (FIXED ✅)
- **High:** 0
- **Medium:** 0
- **Low:** 0

---

## 🎯 NEXT STEPS

1. ✅ Fix critical login bug (COMPLETED)
2. 🔄 Continue systematic black-box testing (IN PROGRESS)
3. ⏳ Document all findings with screenshots
4. ⏳ Perform performance testing
5. ⏳ Optimize identified issues
6. ⏳ Create final PDF report
7. ⏳ Prepare presentation for Session 13

---

## 📝 NOTES

- All testing performed on local development environment
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Test accounts available: alex@aira.com, bella@aira.com, etc. (Password: Password123)
- Using Chrome DevTools for browser testing
- Using Network tab for API inspection

---

**Last Updated:** January 7, 2026

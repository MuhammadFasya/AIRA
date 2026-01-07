# AIRA Mental Health Chatbot - Testing & Debugging Plan

## Project Information

- **Project Name**: AIRA (AI-powered Mental Health Chatbot)
- **Testing Date**: January 3, 2026
- **Tester**: Muhammad Fasya
- **Testing Type**: Black-Box Testing
- **Technology Stack**: React + Vite (Frontend), Flask + PostgreSQL (Backend), Groq API (AI)

---

## 1. BLACK-BOX TESTING PLAN

### 1.1 Authentication Module Testing

#### Test Case 1.1.1: Login with Valid Credentials

- **Input**: Valid email (alex@aira.com) + correct password (aira123)
- **Expected Output**:
  - Successful login
  - User redirected to Home page
  - Token stored in localStorage
  - Welcome toast notification displayed
  - User avatar and name shown in navbar
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_
- **Screenshot**: _[Attach screenshot]_

#### Test Case 1.1.2: Login with Invalid Email

- **Input**: Invalid email (test@invalid.com) + any password
- **Expected Output**:
  - Login fails
  - Error toast notification: "Login failed. Please check your credentials."
  - User remains on login page
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.1.3: Login with Invalid Password

- **Input**: Valid email (alex@aira.com) + wrong password
- **Expected Output**:
  - Login fails
  - Error toast notification displayed
  - User remains on login page
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.1.4: Login with Empty Fields

- **Input**: Empty email and/or empty password
- **Expected Output**:
  - HTML5 validation prevents submission
  - Required field indicators shown
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.1.5: Token Persistence (Refresh Browser)

- **Input**: Login successfully, then refresh browser (F5)
- **Expected Output**:
  - User remains logged in
  - No redirect to login page
  - User data persists
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.1.6: Token Expiration (3 Days)

- **Input**: Login, wait 3 days OR manually modify token expiration in localStorage
- **Expected Output**:
  - Auto-logout after 3 days
  - Redirect to login page
  - localStorage cleared
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.1.7: Logout Functionality

- **Input**: Click logout button in settings
- **Expected Output**:
  - User logged out
  - Redirect to login page
  - localStorage cleared
  - Logout toast notification displayed
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

---

### 1.2 Chat Functionality Testing

#### Test Case 1.2.1: Send Simple Message

- **Input**: Type "Hello, I'm feeling anxious" and send
- **Expected Output**:
  - Message appears in chat area
  - AI response received within 3-5 seconds
  - Response is relevant and empathetic
  - Message saved to database
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.2.2: Send Empty Message

- **Input**: Click send button without typing anything
- **Expected Output**:
  - Nothing happens OR validation prevents sending
  - No API request made
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.2.3: Send Very Long Message (>500 characters)

- **Input**: Type 1000+ character message
- **Expected Output**:
  - Message sent successfully
  - AI responds appropriately
  - No character limit errors
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.2.4: Send Special Characters

- **Input**: Message with emojis, symbols: "I'm feeling 😢 sad... help!!!"
- **Expected Output**:
  - Special characters handled correctly
  - AI responds normally
  - No encoding errors
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.2.5: Chat History Persistence

- **Input**: Send messages, logout, login again
- **Expected Output**:
  - Previous chat history loaded
  - Messages appear in correct order
  - Timestamps preserved
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.2.6: Multiple Rapid Messages

- **Input**: Send 5-10 messages quickly in succession
- **Expected Output**:
  - All messages queued and sent
  - All AI responses received
  - No messages lost
  - Responses in correct order
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.2.7: API Error Handling

- **Input**: Disconnect internet, send message
- **Expected Output**:
  - Error toast: "Cannot connect to server. Please check your connection."
  - Message not lost (could be queued)
  - User can retry
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.2.8: New Chat Creation

- **Input**: Click "New Chat" button
- **Expected Output**:
  - Current chat saved to history
  - New empty chat session starts
  - Chat ID updated
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.2.9: Search Chat History

- **Input**: Open search modal, search for "anxiety"
- **Expected Output**:
  - Matching chats displayed
  - Search is case-insensitive
  - Can click to load chat
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.2.10: View Chat History

- **Input**: Open history modal, select previous chat
- **Expected Output**:
  - Chat history modal displays all chats
  - Clicking a chat loads it
  - Messages appear correctly
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

---

### 1.3 Settings Module Testing

#### Test Case 1.3.1: Theme Toggle (Light to Dark)

- **Input**: Click theme toggle button
- **Expected Output**:
  - Theme changes from light to dark
  - All components update colors
  - Theme preference saved
  - Theme persists after refresh
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.3.2: Theme Toggle (Dark to Light)

- **Input**: Click theme toggle button in dark mode
- **Expected Output**:
  - Theme changes from dark to light
  - All components update colors
  - Theme preference saved
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.3.3: Language Switch to Indonesian

- **Input**: Open settings, click "Bahasa Indonesia"
- **Expected Output**:
  - All UI text changes to Indonesian
  - Success toast in Indonesian
  - Language preference saved
  - Persists after refresh
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.3.4: Language Switch to English

- **Input**: From Indonesian, switch back to English
- **Expected Output**:
  - All UI text changes to English
  - Success toast displayed
  - Language preference saved
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.3.5: Update Profile Name

- **Input**: Change name to "Test User", click save
- **Expected Output**:
  - Success toast: "Profile updated successfully!"
  - Name updated in navbar
  - Change saved to database
  - Persists after logout/login
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.3.6: Update Profile with Empty Name

- **Input**: Clear name field, try to save
- **Expected Output**:
  - Validation prevents saving OR
  - Reverts to original name
  - No error occurs
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

---

### 1.4 Responsive Design Testing

#### Test Case 1.4.1: Mobile View (320px - 640px)

- **Devices to Test**: iPhone SE, Galaxy S8
- **Expected Output**:
  - Login modal fits screen without scrolling
  - Chat area readable and usable
  - Settings modal accessible
  - Buttons properly sized for touch
  - No horizontal scrolling
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.4.2: Tablet View (641px - 1024px)

- **Devices to Test**: iPad, iPad Air
- **Expected Output**:
  - Layout optimized for tablet
  - Larger text and spacing
  - All features accessible
  - No UI overlap
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.4.3: Desktop View (1025px+)

- **Devices to Test**: Desktop browser (1920x1080)
- **Expected Output**:
  - Full-width layout
  - Optimal spacing and typography
  - All features easily accessible
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

#### Test Case 1.4.4: Orientation Change (Mobile)

- **Input**: Rotate device from portrait to landscape
- **Expected Output**:
  - Layout adapts smoothly
  - No content cut off
  - All elements remain accessible
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed
- **Actual Result**: _[To be filled during testing]_

---

### 1.5 Cross-Browser Testing

#### Test Case 1.5.1: Google Chrome

- **Expected Output**: All features work correctly
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

#### Test Case 1.5.2: Mozilla Firefox

- **Expected Output**: All features work correctly
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

#### Test Case 1.5.3: Microsoft Edge

- **Expected Output**: All features work correctly
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

#### Test Case 1.5.4: Safari (if available)

- **Expected Output**: All features work correctly
- **Test Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## 2. BUG TRACKING & FIXES

### Bug Template

For each bug found, document:

```
Bug #X: [Short Description]
Severity: Critical | High | Medium | Low
Module: Authentication | Chat | Settings | UI
Steps to Reproduce:
1. Step 1
2. Step 2
3. ...

Expected Behavior: [What should happen]
Actual Behavior: [What actually happens]
Screenshot: [Attach screenshot]
Root Cause: [Technical explanation]
Fix Applied: [Code changes made]
Status: Open | In Progress | Fixed | Verified
```

### Example Bug Report

```
Bug #1: Toast notifications not showing on mobile devices
Severity: Medium
Module: UI
Steps to Reproduce:
1. Open app on mobile (320px width)
2. Login with valid credentials
3. Observe toast notification

Expected Behavior: Toast should appear at top-center of screen
Actual Behavior: Toast appears off-screen or overlaps with other elements
Screenshot: [screenshot.png]
Root Cause: z-index conflict or positioning issue
Fix Applied: Updated toast container styles in main.jsx
Status: Fixed
```

---

## 3. PERFORMANCE OPTIMIZATION

### 3.1 Performance Metrics to Measure

#### Initial Load Time

- **Metric**: Time to Interactive (TTI)
- **Target**: < 3 seconds
- **Current**: _[To be measured]_
- **Tool**: Chrome DevTools Lighthouse

#### Bundle Size

- **Metric**: Total JavaScript bundle size
- **Target**: < 500 KB
- **Current**: _[To be measured]_
- **Tool**: `npm run build` output

#### API Response Time

- **Metric**: Average chat response time
- **Target**: < 3 seconds
- **Current**: _[To be measured]_
- **Tool**: Network tab in DevTools

#### First Contentful Paint (FCP)

- **Target**: < 1.8 seconds
- **Current**: _[To be measured]_

#### Largest Contentful Paint (LCP)

- **Target**: < 2.5 seconds
- **Current**: _[To be measured]_

---

### 3.2 Optimization Tasks

#### Frontend Optimizations

- [ ] **Code Splitting**: Lazy load routes/components
- [ ] **Image Optimization**: Compress images, use WebP format
- [ ] **Tree Shaking**: Remove unused code
- [ ] **Minification**: Ensure production build is minified
- [ ] **Caching**: Add service worker for offline support
- [ ] **Bundle Analysis**: Use `vite-plugin-bundle-analyzer`
- [ ] **Font Optimization**: Subset fonts, use font-display: swap

#### Backend Optimizations

- [ ] **Database Indexing**: Add indexes to frequently queried columns
- [ ] **Query Optimization**: Review and optimize slow queries
- [ ] **Caching**: Implement Redis for session/chat caching
- [ ] **Connection Pooling**: Optimize PostgreSQL connections
- [ ] **API Rate Limiting**: Add rate limiting to prevent abuse
- [ ] **Compression**: Enable gzip compression in Flask

---

### 3.3 Optimization Results Template

```
Optimization: [Name of optimization]
Before:
- Load Time: X seconds
- Bundle Size: X KB
- Performance Score: X/100

After:
- Load Time: X seconds (-X%)
- Bundle Size: X KB (-X%)
- Performance Score: X/100 (+X points)

Implementation Details:
[Code changes made]

Impact: High | Medium | Low
```

---

## 4. TESTING EXECUTION CHECKLIST

### Pre-Testing Setup

- [ ] Ensure both frontend and backend are deployed
- [ ] Backend URL: https://aira-production-9c5a.up.railway.app
- [ ] Frontend URL: [Netlify URL]
- [ ] Test accounts prepared (alex@aira.com, test1@aira.com, etc.)
- [ ] Browser DevTools open for debugging
- [ ] Screenshot tool ready

### During Testing

- [ ] Execute all test cases systematically
- [ ] Document results immediately
- [ ] Take screenshots of bugs
- [ ] Note any unexpected behavior
- [ ] Test on multiple devices/browsers

### Post-Testing

- [ ] Compile all test results
- [ ] Prioritize bugs by severity
- [ ] Fix critical and high-priority bugs
- [ ] Verify fixes with re-testing
- [ ] Measure performance improvements
- [ ] Document all changes

---

## 5. DELIVERABLE REQUIREMENTS

### PDF Document Structure

1. **Cover Page**

   - Project title: AIRA Mental Health Chatbot
   - Student name and ID
   - Testing date
   - Course information

2. **Executive Summary** (1 page)

   - Overview of testing conducted
   - Key findings
   - Bugs found and fixed
   - Performance improvements

3. **Testing Methodology** (2-3 pages)

   - Black-box testing approach
   - Test coverage (modules tested)
   - Tools used
   - Testing environment

4. **Test Results** (5-10 pages)

   - All test cases with results
   - Screenshots of testing
   - Pass/fail summary table

5. **Bug Reports** (3-5 pages)

   - Detailed bug documentation
   - Severity classification
   - Fixes implemented
   - Before/after screenshots

6. **Performance Analysis** (2-3 pages)

   - Performance metrics before optimization
   - Optimizations implemented
   - Performance metrics after optimization
   - Graphs/charts showing improvements

7. **Conclusion** (1 page)

   - Summary of work completed
   - Lessons learned
   - Future improvements

8. **Appendix**
   - Code snippets of fixes
   - Additional screenshots
   - Testing tools documentation

---

## 6. PRESENTATION PREPARATION (Session 13)

### Presentation Structure (10-15 slides)

1. **Title Slide**

   - Project name
   - Your name
   - Date

2. **Project Overview** (1 slide)

   - What is AIRA?
   - Technology stack
   - Key features

3. **Testing Methodology** (1-2 slides)

   - Black-box testing approach
   - Modules tested
   - Number of test cases

4. **Testing Results Summary** (1 slide)

   - Total test cases: X
   - Passed: X
   - Failed: X
   - Pass rate: X%

5. **Bugs Found** (2-3 slides)

   - List of bugs with severity
   - Screenshots showing issues
   - Impact on user experience

6. **Bug Fixes** (2-3 slides)

   - Before/after comparisons
   - Code snippets
   - Verification results

7. **Performance Optimization** (2-3 slides)

   - Initial performance metrics
   - Optimizations implemented
   - Performance improvements (graphs)

8. **Live Demo** (2-3 minutes)

   - Show working application
   - Demonstrate key features
   - Show responsive design

9. **Challenges & Solutions** (1 slide)

   - Challenges faced
   - How they were overcome

10. **Conclusion** (1 slide)
    - Key achievements
    - Lessons learned
    - Future work

---

## 7. TOOLS TO USE

### Testing Tools

- **Browser DevTools**: Chrome DevTools (Network, Performance, Lighthouse)
- **Responsive Design**: Chrome DevTools Device Mode
- **Performance**: Google Lighthouse, WebPageTest
- **Bundle Analysis**: `npm run build`, vite-plugin-bundle-analyzer
- **API Testing**: Postman or Thunder Client (VS Code extension)

### Documentation Tools

- **Screenshots**: Windows Snipping Tool, ShareX, or Lightshot
- **PDF Creation**: Microsoft Word → Export to PDF
- **Presentation**: PowerPoint or Google Slides
- **Screen Recording**: OBS Studio or Windows Game Bar (Win + G)

### Performance Analysis

- **Chrome Lighthouse**: Built into Chrome DevTools
- **Network Analysis**: Chrome DevTools Network tab
- **Bundle Analyzer**: Run `npm run build -- --analyze`

---

## NEXT STEPS

1. **Start Testing** (Day 1-2)

   - Execute all test cases
   - Document results and bugs
   - Take screenshots

2. **Fix Bugs** (Day 3-4)

   - Prioritize critical bugs
   - Implement fixes
   - Verify fixes work

3. **Optimize Performance** (Day 4-5)

   - Measure current performance
   - Implement optimizations
   - Measure improvements

4. **Create Documentation** (Day 5-6)

   - Compile all results into PDF
   - Create presentation slides
   - Practice demo

5. **Submit & Present** (Session 13)
   - Submit PDF one day before
   - Present findings in class
   - Answer questions

# AIRA Testing & Debugging - Quick Start Guide

## 📋 Assignment Overview

**What to do:**

1. ✅ Perform black-box testing on AIRA chatbot
2. ✅ Find and fix bugs
3. ✅ Optimize website performance

**What to submit:**

- 📄 PDF document with all testing results
- 📊 Presentation for Session 13
- 📅 Submit one day before next session

---

## 🚀 Step-by-Step Guide

### **DAY 1-2: BLACK-BOX TESTING**

#### Step 1: Setup Testing Environment

```bash
# Make sure frontend and backend are deployed
# Frontend URL: [Your Netlify URL]
# Backend URL: https://aira-production-9c5a.up.railway.app

# Test accounts available:
# alex@aira.com / aira123
# test1@aira.com / aira123
# demo@aira.com / aira123
```

#### Step 2: Run Testing Script

```bash
cd c:\Aira-Web
python testing_automation.py
```

This creates:

- ✅ `testing_results.json` - Stores test results
- ✅ `TESTING_RESULTS.md` - Readable report

#### Step 3: Execute Test Cases Manually

**Authentication Tests (30 minutes):**

- [ ] Login with valid credentials
- [ ] Login with invalid email
- [ ] Login with wrong password
- [ ] Login with empty fields
- [ ] Check token persistence (refresh browser)
- [ ] Test logout functionality
- [ ] Test token expiration (simulate by editing localStorage)

**Chat Tests (45 minutes):**

- [ ] Send simple message
- [ ] Send empty message (should be blocked)
- [ ] Send long message (1000+ chars)
- [ ] Send special characters and emojis
- [ ] Send multiple rapid messages
- [ ] Check chat history persistence
- [ ] Create new chat
- [ ] Search chat history
- [ ] Test offline behavior (disconnect internet)

**Settings Tests (30 minutes):**

- [ ] Toggle theme (light ↔ dark)
- [ ] Switch language (English ↔ Indonesian)
- [ ] Update profile name
- [ ] Test with empty profile name
- [ ] Check settings persistence after logout

**Responsive Design Tests (45 minutes):**

- [ ] Test on mobile (320px - 640px)
  - Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
  - Test iPhone SE, iPhone 12
- [ ] Test on tablet (641px - 1024px)
  - Test iPad, iPad Air
- [ ] Test on desktop (1025px+)
  - Test 1920x1080, 1366x768
- [ ] Test orientation change (portrait ↔ landscape)

**Cross-Browser Tests (30 minutes):**

- [ ] Google Chrome
- [ ] Mozilla Firefox
- [ ] Microsoft Edge
- [ ] Safari (if Mac available)

#### Step 4: Document Results

For each test:

```python
# Example: Update test case result
tc1.update_result(
    "Passed",  # or "Failed"
    "Actual result description",
    "screenshots/test_screenshot.png"  # optional
)
```

**Take screenshots for:**

- ✅ Every successful feature
- ❌ Every bug found
- 📊 Before/after comparisons

---

### **DAY 3-4: BUG FIXING**

#### Step 1: Prioritize Bugs

Create bug reports using the script:

```python
bug = BugReport(
    "BUG-001",
    "Toast notification not visible on mobile",
    "Medium",  # Critical, High, Medium, Low
    "UI"
)
bug.add_step("Open app on mobile (320px)")
bug.add_step("Login successfully")
bug.add_step("Observe toast notification")
bug.expected_behavior = "Toast should be clearly visible"
bug.actual_behavior = "Toast partially hidden behind navbar"
bug.screenshot = "screenshots/toast_bug.png"
```

**Priority order:**

1. **Critical**: App crashes, security issues, data loss
2. **High**: Major features broken, poor UX
3. **Medium**: Minor features broken, cosmetic issues
4. **Low**: Nice-to-have improvements

#### Step 2: Fix Bugs

Common bugs to check:

- [ ] Toast notifications z-index on mobile
- [ ] Responsive layout issues on small screens
- [ ] Input validation not working
- [ ] API error handling incomplete
- [ ] Theme not persisting correctly
- [ ] Language toggle not working properly
- [ ] Chat history not loading
- [ ] Token expiration not triggering logout

#### Step 3: Verify Fixes

After fixing each bug:

```python
bug.mark_fixed("Updated z-index to 9999 and adjusted positioning")
bug.status = "Verified"
```

Re-test to ensure:

- ✅ Bug is actually fixed
- ✅ Fix didn't break anything else
- ✅ Fix works across browsers/devices

---

### **DAY 4-5: PERFORMANCE OPTIMIZATION**

#### Step 1: Measure Baseline Performance

**Using Chrome Lighthouse:**

1. Open deployed app in Chrome Incognito (Ctrl+Shift+N)
2. Open DevTools (F12)
3. Go to Lighthouse tab
4. Select: ✅ Performance ✅ Best Practices
5. Click "Analyze page load"
6. Record these metrics:

```python
# In performance_testing.py
metrics[0].set_before(4200)  # Time to Interactive (ms)
metrics[1].set_before(2100)  # First Contentful Paint (ms)
metrics[2].set_before(3800)  # Largest Contentful Paint (ms)
metrics[5].set_before(650)   # Bundle Size (KB)
metrics[6].set_before(2500)  # Chat API Response Time (ms)
```

**Using Network Tab:**

1. Open DevTools → Network tab
2. Reload page (Ctrl+R)
3. Check:
   - Total transfer size
   - Number of requests
   - Load time
   - API response times

**Check Bundle Size:**

```bash
cd c:\Aira-Web\frontend
npm run build
# Check output for bundle sizes
```

#### Step 2: Implement Optimizations

**Frontend Optimizations:**

**1. Code Splitting (High Impact)**

```javascript
// In App.jsx, replace regular imports with lazy imports
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const Settings = lazy(() => import("./pages/Settings"));

// Wrap routes with Suspense
<Suspense fallback={<LoadingScreen />}>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</Suspense>;
```

**2. Image Optimization (Medium Impact)**

```bash
# Install image optimizer
npm install --save-dev vite-plugin-image-optimizer

# Add to vite.config.js
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default {
  plugins: [
    react(),
    ViteImageOptimizer()
  ]
}
```

**3. Font Optimization (Low Impact)**

```css
/* In index.css, add font-display */
@font-face {
  font-family: "Montserrat";
  font-display: swap; /* Prevents invisible text during load */
  src: url("/assets/fonts/Montserrat/...");
}
```

**4. Bundle Analysis**

```bash
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    react(),
    visualizer({ open: true })
  ]
}

# Build and analyze
npm run build
```

**Backend Optimizations:**

**1. Add Database Indexes (High Impact)**

```python
# In models.py, check if indexes exist on:
# - user_id in Chat model
# - chat_id in Message model
# - email in User model (for login queries)

# If not, add in create_users.py or migration script
```

**2. Enable Response Compression (Medium Impact)**

```python
# In app.py, add Flask-Compress
from flask_compress import Compress

app = Flask(__name__)
Compress(app)  # Enables gzip compression
```

**3. Optimize Chat API (Medium Impact)**

```python
# In chat_routes.py, add query optimization
# Use pagination for chat history
# Limit message history to last 50 messages
# Add caching for frequent queries
```

#### Step 3: Measure After Optimization

Run Lighthouse again and record improvements:

```python
metrics[0].set_after(2800)  # TTI improved!
metrics[5].set_after(450)   # Bundle size reduced!

optimizations[0].mark_completed(
    "High",
    "Implemented React.lazy() for Home and Settings, reduced bundle by 200KB"
)
```

#### Step 4: Document Improvements

Generate performance report:

```bash
python performance_testing.py
```

Creates:

- ✅ `performance_results.json`
- ✅ `PERFORMANCE_RESULTS.md`

---

### **DAY 5-6: CREATE DOCUMENTATION**

#### Step 1: Generate Test Reports

```bash
python testing_automation.py
python performance_testing.py
```

#### Step 2: Create PDF Document

**Use this structure:**

1. **Cover Page** (1 page)

   - Title: AIRA Mental Health Chatbot - Testing & Debugging Report
   - Your name and student ID
   - Date: January 2026
   - Course name

2. **Executive Summary** (1 page)

   - Overview of project
   - Testing approach
   - Key findings (bugs found, performance improvement %)
   - Conclusion

3. **Project Overview** (1-2 pages)

   - What is AIRA?
   - Technology stack
   - Features implemented
   - Screenshots of app

4. **Testing Methodology** (2 pages)

   - Black-box testing approach
   - Test environment
   - Tools used
   - Test coverage

5. **Test Results** (5-7 pages)

   - Authentication tests (table with results)
   - Chat functionality tests (table with results)
   - Settings tests (table with results)
   - Responsive design tests (screenshots on mobile/tablet/desktop)
   - Cross-browser tests
   - Summary: X/Y tests passed (X% pass rate)

6. **Bugs Found & Fixed** (3-5 pages)

   - List all bugs with severity
   - For each bug:
     - Description
     - Steps to reproduce
     - Screenshots (before)
     - Root cause
     - Fix applied
     - Screenshots (after)
     - Status (Fixed/Verified)

7. **Performance Optimization** (3-4 pages)

   - Initial performance metrics (Lighthouse scores, bundle size)
   - Optimizations implemented:
     - Code splitting
     - Image optimization
     - Database indexing
     - Response compression
   - After performance metrics
   - Comparison table (before vs after)
   - Graphs showing improvement

8. **Conclusion** (1 page)

   - Summary of testing
   - Total bugs fixed
   - Performance improvement %
   - Lessons learned
   - Future recommendations

9. **Appendix** (2-3 pages)
   - Code snippets of important fixes
   - Additional screenshots
   - Raw data tables

**Tools for PDF Creation:**

- Microsoft Word → Export to PDF
- Google Docs → Download as PDF
- LaTeX (for advanced formatting)

#### Step 3: Create Presentation (10-15 slides)

**Slide Structure:**

1. **Title Slide**

   - Project name
   - Your name
   - Date

2. **Project Overview** (1 slide)

   - What is AIRA?
   - Screenshot of app
   - Technology stack

3. **Testing Approach** (1 slide)

   - Black-box testing
   - Modules tested
   - 50+ test cases executed

4. **Testing Results** (1-2 slides)

   - Total test cases: 52
   - Passed: 48 (92%)
   - Failed: 4 (8%)
   - Pass rate chart

5. **Bugs Found** (2 slides)

   - Table of bugs with severity
   - Screenshots of major bugs

6. **Bug Fixes** (2-3 slides)

   - Before/after comparisons
   - Code snippets
   - Impact on UX

7. **Performance Before** (1 slide)

   - Lighthouse scores
   - Load time: 4.2s
   - Bundle size: 650 KB

8. **Optimizations** (1-2 slides)

   - List of optimizations
   - Code splitting
   - Image compression
   - Database indexing

9. **Performance After** (1 slide)

   - Lighthouse scores improved
   - Load time: 2.8s (-33%)
   - Bundle size: 450 KB (-31%)
   - Comparison chart

10. **Live Demo** (Optional)

    - Show working app
    - Demonstrate fixes

11. **Challenges & Solutions** (1 slide)

    - Challenge 1: Toast z-index on mobile
    - Solution: Updated CSS with higher z-index
    - Challenge 2: Large bundle size
    - Solution: Implemented code splitting

12. **Conclusion** (1 slide)
    - Key achievements
    - Lessons learned
    - Thank you

---

## 📊 Metrics to Track

### Testing Metrics

- Total test cases executed: **\_**
- Test cases passed: **\_**
- Test cases failed: **\_**
- Pass rate: **\_**%
- Total bugs found: **\_**
- Critical bugs: **\_**
- High priority bugs: **\_**
- Medium priority bugs: **\_**
- Low priority bugs: **\_**
- Bugs fixed: **\_**

### Performance Metrics

- Time to Interactive: **\_** ms → **\_** ms (\_\_\_% improvement)
- First Contentful Paint: **\_** ms → **\_** ms (\_\_\_% improvement)
- Bundle Size: **\_** KB → **\_** KB (\_\_\_% reduction)
- Lighthouse Performance Score: **_/100 → _**/100 (+\_\_\_ points)
- Chat API Response: **\_** ms → **\_** ms (\_\_\_% improvement)

---

## 🎯 Checklist Before Submission

### Testing Completed

- [ ] All authentication tests executed
- [ ] All chat functionality tests executed
- [ ] All settings tests executed
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Cross-browser testing completed
- [ ] All results documented with screenshots

### Bugs Addressed

- [ ] All critical bugs fixed
- [ ] All high priority bugs fixed
- [ ] Medium/low bugs addressed (or documented as future work)
- [ ] All fixes verified and tested
- [ ] Before/after screenshots captured

### Performance Optimized

- [ ] Baseline performance measured
- [ ] Code splitting implemented
- [ ] Images optimized
- [ ] Bundle size reduced
- [ ] Backend optimizations applied
- [ ] After performance measured
- [ ] Improvements documented

### Documentation Complete

- [ ] PDF document created (15-25 pages)
- [ ] All sections included
- [ ] Screenshots embedded
- [ ] Tables and charts included
- [ ] Formatted professionally
- [ ] Proofread for errors

### Presentation Ready

- [ ] PowerPoint/Google Slides created (10-15 slides)
- [ ] Key points highlighted
- [ ] Before/after comparisons included
- [ ] Live demo prepared
- [ ] Practiced presentation (10-15 minutes)

---

## 🔧 Troubleshooting

**Q: Testing script not working?**

```bash
# Make sure you're in the project directory
cd c:\Aira-Web

# Install Python if needed
python --version

# Run script
python testing_automation.py
```

**Q: Can't measure performance?**

- Use Chrome Incognito mode (Ctrl+Shift+N)
- Clear cache before testing
- Close other tabs/apps
- Use DevTools → Lighthouse tab

**Q: How to take screenshots?**

- Windows: Snipping Tool (Win+Shift+S)
- Chrome: DevTools → Device Toolbar → Screenshot icon
- Full page: Chrome extension "Full Page Screen Capture"

**Q: How to simulate token expiration?**

1. Login successfully
2. Open DevTools → Application → Local Storage
3. Find `aira_token`
4. Copy token to jwt.io to see expiration
5. Manually edit exp timestamp to past time
6. Refresh page → should auto-logout

---

## 📚 Resources

- **Chrome DevTools**: F12 in Chrome
- **Lighthouse**: DevTools → Lighthouse tab
- **Testing Plan**: `TESTING_PLAN.md` (detailed test cases)
- **Test Results**: `TESTING_RESULTS.md` (auto-generated)
- **Performance**: `PERFORMANCE_RESULTS.md` (auto-generated)

---

## 💡 Tips for Success

1. **Be Systematic**: Follow the testing plan step-by-step
2. **Document Everything**: Take screenshots of everything
3. **Prioritize**: Fix critical bugs first
4. **Measure Impact**: Show before/after comparisons
5. **Be Honest**: Document what works AND what doesn't
6. **Show Data**: Use charts and tables in presentation
7. **Practice Demo**: Rehearse live demo multiple times
8. **Time Management**: Allocate 5-6 days for all tasks

---

## 🎉 Good Luck!

You have all the tools and resources you need. Follow this guide step-by-step, and you'll have a comprehensive testing report ready for submission!

**Questions?** Review the detailed `TESTING_PLAN.md` file.

**Need help?** Check the code in `testing_automation.py` and `performance_testing.py`.

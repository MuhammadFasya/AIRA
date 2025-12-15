# 📊 Database & Beta Testing Guide

## 💾 How Conversation History is Stored

### Database Structure

AIRA uses **SQLite** database (in development) or **PostgreSQL** (in production) to store all data.

#### Tables:

**1. Users Table**

```
id          | INTEGER (Primary Key)
name        | STRING (User's display name)
email       | STRING (Unique login email)
password_hash | STRING (Encrypted password)
```

**2. Chats Table**

```
id          | INTEGER (Primary Key)
user_id     | INTEGER (Foreign Key → users.id)
message     | TEXT (Message content)
sender      | STRING ('user' or 'aira')
timestamp   | DATETIME (UTC timestamp)
```

### Where is the Database?

**Development:**

- File: `backend/instance/aira.db`
- Type: SQLite database
- Each user's conversations are linked to their user_id
- All messages (both user and AI) are stored in the `chats` table

**Production (after deployment):**

- Railway provides PostgreSQL database
- Automatically connected via `DATABASE_URL` environment variable
- Same structure, just different database engine

---

## 🔍 How to Access Conversation History

### Method 1: Through the App (Recommended)

- Users can see their own history by clicking the **History** button in the sidebar
- Shows list of recent conversation topics

### Method 2: Direct Database Query (Admin Only)

#### For SQLite (Development):

```bash
# Navigate to backend folder
cd backend

# Open database
sqlite3 instance/aira.db

# View all users
SELECT * FROM users;

# View all chats for a specific user (e.g., user_id = 1)
SELECT * FROM chats WHERE user_id = 1 ORDER BY timestamp DESC;

# View recent conversations across all users
SELECT
  u.name,
  u.email,
  c.sender,
  c.message,
  c.timestamp
FROM chats c
JOIN users u ON c.user_id = u.id
ORDER BY c.timestamp DESC
LIMIT 20;

# Exit sqlite
.quit
```

#### For PostgreSQL (Production):

```bash
# In Railway dashboard
# Go to your PostgreSQL database
# Click "Query" tab
# Run SQL queries directly
```

### Method 3: Create Admin Endpoint (Optional)

You can add this to `chat_routes.py` for easy admin access:

```python
@chat_bp.route('/admin/chats/<int:user_id>', methods=['GET'])
@jwt_required()  # Add admin check if needed
def get_user_chats(user_id):
    """Get all chats for a specific user"""
    chats = Chat.query.filter_by(user_id=user_id).order_by(Chat.timestamp.desc()).all()
    return jsonify([chat.to_dict() for chat in chats]), 200
```

---

## 👥 Beta Tester Accounts

### Current Beta Testers: **12 accounts**

#### Primary Beta Testers (10 unique accounts):

| Name             | Email           | Password   | Purpose        |
| ---------------- | --------------- | ---------- | -------------- |
| Alex Chen        | alex@aira.com   | alex2025   | Beta Tester 1  |
| Sarah Johnson    | sarah@aira.com  | sarah2025  | Beta Tester 2  |
| Miguel Rodriguez | miguel@aira.com | miguel2025 | Beta Tester 3  |
| Priya Patel      | priya@aira.com  | priya2025  | Beta Tester 4  |
| Jordan Kim       | jordan@aira.com | jordan2025 | Beta Tester 5  |
| Emma Wilson      | emma@aira.com   | emma2025   | Beta Tester 6  |
| Lucas Silva      | lucas@aira.com  | lucas2025  | Beta Tester 7  |
| Zara Ahmed       | zara@aira.com   | zara2025   | Beta Tester 8  |
| Ryan Taylor      | ryan@aira.com   | ryan2025   | Beta Tester 9  |
| Nina Kowalski    | nina@aira.com   | nina2025   | Beta Tester 10 |

#### Test Accounts (2):

| Name        | Email          | Password    | Purpose         |
| ----------- | -------------- | ----------- | --------------- |
| Test User 1 | test1@aira.com | password123 | General testing |
| Demo User   | demo@aira.com  | demo123     | Demo/showcase   |

---

## 🔐 Multiple Users & Simultaneous Login

### Can Multiple Users Login at the Same Time?

**YES!** ✅

### How It Works:

1. **Each User Has Their Own Account**

   - Every beta tester has unique email/password
   - JWT tokens are generated per user session
   - Each user sees only THEIR conversation history

2. **Simultaneous Login is Supported**

   - User 1 can login with `alex@aira.com`
   - User 2 can login with `sarah@aira.com`
   - Both can chat at the same time
   - Their conversations are completely separate

3. **Data Isolation**
   - Each user's chats are linked to their `user_id`
   - User 1 cannot see User 2's messages
   - Database queries filter by `user_id` automatically

### ❌ What DOESN'T Work:

**Same account on multiple devices simultaneously:**

- If 2 people login with `alex@aira.com` at the same time
- Both will be logged in (JWT tokens are stateless)
- Both will see the same conversation history
- This is normal behavior for most web apps

**Solution:** Give each beta tester their own unique account!

---

## 🧪 Beta Testing Setup

### Step 1: Create All Test Accounts

```bash
cd backend
python create_users.py
```

This creates all 12 accounts listed above.

### Step 2: Share Credentials with Beta Testers

**Send each tester:**

```
🎉 Welcome to AIRA Beta Testing!

Your login credentials:
Email: [their_email@aira.com]
Password: [their_password2025]

App URL: https://your-app.netlify.app

Instructions:
1. Open the URL in your browser
2. Login with your credentials
3. Try chatting with Aira about your day
4. Test features: profile picture, theme switching, search, history
5. Report any bugs or feedback

Thank you for helping us improve AIRA! 🚀
```

### Step 3: Monitoring Beta Testing

**Track Usage:**

```sql
-- Count total conversations per user
SELECT
  u.email,
  u.name,
  COUNT(c.id) as message_count,
  MAX(c.timestamp) as last_active
FROM users u
LEFT JOIN chats c ON u.id = c.user_id
GROUP BY u.id
ORDER BY message_count DESC;
```

**Check Active Users:**

```sql
-- Users active in last 24 hours
SELECT DISTINCT u.email, u.name
FROM users u
JOIN chats c ON u.id = c.user_id
WHERE c.timestamp > datetime('now', '-1 day');
```

---

## 📝 Beta Testing Feedback Form

Create a simple form for beta testers to submit feedback:

**Questions to Ask:**

1. How easy was it to start chatting with Aira? (1-5)
2. Did Aira's responses feel helpful and empathetic?
3. Which features did you use? (theme, search, history, profile)
4. Any bugs or issues encountered?
5. What would you improve?
6. Would you recommend AIRA to a friend?

---

## 🚀 After Beta Testing

### Scaling Beyond 12 Users:

1. **Remove Test Accounts** - Keep only real user signups
2. **Add User Registration** - Let users create their own accounts
3. **Email Verification** - Optional but recommended
4. **Password Reset** - Add forgot password feature
5. **User Analytics** - Track engagement and usage patterns

---

## 📊 Summary

✅ **Conversation History**: Stored in database (SQLite dev, PostgreSQL prod)  
✅ **Access**: Users see only their own history via History button  
✅ **Beta Testers**: 12 unique accounts ready to use  
✅ **Simultaneous Login**: Yes! Each tester has their own account  
✅ **Data Isolation**: Each user's data is completely separate

**Next Step:** Run `python create_users.py` to create all beta accounts! 🎉

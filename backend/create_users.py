"""
Quick script to create test users for Aira
Run: python create_users.py
"""
from app import create_app
from models import db, User
from auth_routes import bcrypt

def create_test_users():
    app = create_app()
    
    with app.app_context():
        # Create database tables if they don't exist
        db.create_all()
        
        # Test users to create - Each has unique credentials for beta testing
        test_users = [
            {'name': 'Alex Chen', 'email': 'alex@aira.com', 'password': 'alex2025'},
            {'name': 'Sarah Johnson', 'email': 'sarah@aira.com', 'password': 'sarah2025'},
            {'name': 'Miguel Rodriguez', 'email': 'miguel@aira.com', 'password': 'miguel2025'},
            {'name': 'Priya Patel', 'email': 'priya@aira.com', 'password': 'priya2025'},
            {'name': 'Jordan Kim', 'email': 'jordan@aira.com', 'password': 'jordan2025'},
            {'name': 'Emma Wilson', 'email': 'emma@aira.com', 'password': 'emma2025'},
            {'name': 'Lucas Silva', 'email': 'lucas@aira.com', 'password': 'lucas2025'},
            {'name': 'Zara Ahmed', 'email': 'zara@aira.com', 'password': 'zara2025'},
            {'name': 'Ryan Taylor', 'email': 'ryan@aira.com', 'password': 'ryan2025'},
            {'name': 'Nina Kowalski', 'email': 'nina@aira.com', 'password': 'nina2025'},
            # Keep original test accounts
            {'name': 'Test User 1', 'email': 'test1@aira.com', 'password': 'password123'},
            {'name': 'Demo User', 'email': 'demo@aira.com', 'password': 'demo123'},
        ]
        
        for user_data in test_users:
            # Check if user already exists
            existing = User.query.filter_by(email=user_data['email']).first()
            if existing:
                print(f"✓ User {user_data['email']} already exists")
                continue
            
            # Create new user
            user = User(
                name=user_data['name'],
                email=user_data['email'],
                password_hash=bcrypt.generate_password_hash(user_data['password']).decode('utf-8')
            )
            db.session.add(user)
            print(f"✓ Created user: {user_data['email']} (password: {user_data['password']})")
        
        db.session.commit()
        print("\n=== All test users created successfully! ===")
        print("\nLogin credentials:")
        for user_data in test_users:
            print(f"  Email: {user_data['email']} | Password: {user_data['password']}")

if __name__ == '__main__':
    create_test_users()

"""
Quick script to create test users for Aira
Run: python create_users.py
"""
from app import create_app
from models import db, User
from flask_bcrypt import generate_password_hash

def create_test_users():
    app = create_app()
    
    with app.app_context():
        # Create database tables if they don't exist
        db.create_all()
        
        # Test users to create
        test_users = [
            {'name': 'Test User 1', 'email': 'test1@aira.com', 'password': 'password123'},
            {'name': 'Test User 2', 'email': 'test2@aira.com', 'password': 'password123'},
            {'name': 'Test User 3', 'email': 'test3@aira.com', 'password': 'password123'},
            {'name': 'Demo User', 'email': 'demo@aira.com', 'password': 'demo123'},
            {'name': 'Beta Tester', 'email': 'beta@aira.com', 'password': 'beta123'},
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
                password_hash=generate_password_hash(user_data['password'])
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

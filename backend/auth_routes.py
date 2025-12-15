"""Authentication blueprint: registration and login using JWT and bcrypt.

Provides endpoints:
- POST /auth/register
- POST /auth/login

This module also exports the `auth_bp` Blueprint and the bcrypt/jwt
instances so the application factory can initialize them.
"""
from datetime import timedelta
import os
from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token

from models import db, User

# Extension singletons (initialized in app factory)
bcrypt = Bcrypt()
jwt = JWTManager()

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user.

    Expected JSON body: { name, email, password }
    Returns: JSON with user info (no password) and 201 status on success.
    """
    try:
        data = request.get_json() or {}
        name = (data.get('name') or '').strip()
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''

        if not name or not email or not password:
            return jsonify({'error': 'name, email and password are required'}), 400

        # Check for existing user
        existing = User.query.filter_by(email=email).first()
        if existing:
            return jsonify({'error': 'A user with that email already exists'}), 409

        # Hash password and create user
        pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')

        user = User(name=name, email=email, password_hash=pw_hash)
        db.session.add(user)
        db.session.commit()

        return jsonify({'user': user.to_dict()}), 201

    except Exception as exc:
        db.session.rollback()
        return jsonify({'error': 'Failed to create user', 'details': str(exc)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user and return JWT access token.

    Expected JSON body: { email, password }
    Returns: { access_token, user }
    """
    try:
        data = request.get_json() or {}
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''

        if not email or not password:
            return jsonify({'error': 'email and password are required'}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid credentials'}), 401

        # Create JWT token; include user id as identity (integer)
        expires = int(os.getenv('JWT_EXP_DAYS', '7'))
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=expires))

        return jsonify({'access_token': access_token, 'user': user.to_dict()}), 200

    except Exception as exc:
        return jsonify({'error': 'Login failed', 'details': str(exc)}), 500

"""
Aira Backend (production-ready rewrite)

This file now acts as the application factory / entrypoint for the Flask
backend. The heavy lifting (models and routes) is implemented in
`models.py`, `auth_routes.py`, and `chat_routes.py` and registered as
Blueprints below. Configuration comes from environment variables.

Why this structure:
- Blueprints make the code modular and easier to test.
- SQLAlchemy manages ORM models and migrations later.
- JWT secures protected routes used by the React frontends.
"""

import os
from datetime import timedelta
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from models import db, ma
from auth_routes import auth_bp, bcrypt, jwt
from chat_routes import chat_bp

# Load environment variables from .env
load_dotenv()


def create_app(config_override: dict | None = None) -> Flask:
    """Create and configure the Flask application.

    Accepts an optional dict to override configuration for tests.
    """
    app = Flask(__name__)

    # Core configuration
    app.config['JSON_SORT_KEYS'] = False
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Secret keys and database
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'please-change-me')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', app.config['SECRET_KEY'])
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///aira.db')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=int(os.getenv('JWT_EXP_DAYS', '7')))

    # Allow overrides (useful for tests)
    if config_override:
        app.config.update(config_override)

    # Initialize extensions
    CORS(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)
    ma.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # JWT error handlers for debugging
    @jwt.invalid_token_loader
    def invalid_token_callback(error_string):
        print(f"JWT ERROR - Invalid token: {error_string}")
        return jsonify({'error': 'Invalid token', 'details': error_string}), 422

    @jwt.unauthorized_loader
    def unauthorized_callback(error_string):
        print(f"JWT ERROR - Unauthorized: {error_string}")
        return jsonify({'error': 'Missing Authorization header', 'details': error_string}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        print(f"JWT ERROR - Expired token")
        return jsonify({'error': 'Token has expired'}), 401

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(chat_bp, url_prefix='')  # chat routes live at /chat*

    # Basic health endpoint
    @app.route('/', methods=['GET'])
    def health():
        return jsonify({'status': 'healthy', 'service': 'AIRA backend'}), 200

    return app


if __name__ == '__main__':
    app = create_app()

    # Create DB tables if they don't exist; safe for simple dev workflows.
    with app.app_context():
        db.create_all()

    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'

    print('=' * 60)
    print('Starting AIRA backend')
    print(f'Host: {host}  Port: {port}  Debug: {debug}')
    print('=' * 60)

    app.run(host=host, port=port, debug=debug)

"""SQLAlchemy models and Marshmallow schemas for AIRA backend.

This file defines the User and Chat models and corresponding simple
Marshmallow schemas used to serialize/deserialize objects to JSON.

Keep models and schema definitions here so other modules can import them
without causing circular imports.
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

# Singleton extension instances (initialized later in app factory)
db = SQLAlchemy()
ma = Marshmallow()


class User(db.Model):
    """User account model.

    Fields:
    - id: primary key
    - name: display name
    - email: unique email
    - password_hash: bcrypt hashed password
    - created_at: timestamp
    """

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    chats = db.relationship('Chat', backref='user', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
        }


class Chat(db.Model):
    """Chat history model. Each record is one message either from the user
    or Aira.

    Fields:
    - id: primary key
    - user_id: FK to users.id
    - message: text content
    - sender: 'user' or 'aira'
    - timestamp: utc timestamp
    """

    __tablename__ = 'chats'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    sender = db.Column(db.String(16), nullable=False)  # 'user' or 'aira'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'message': self.message,
            'sender': self.sender,
            'timestamp': self.timestamp.isoformat(),
        }


# Marshmallow schemas for (de)serialization; these are simple and safe to
# import from other modules.


class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User

    id = ma.auto_field()
    name = ma.auto_field()
    email = ma.auto_field()
    created_at = ma.auto_field()


class ChatSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Chat

    id = ma.auto_field()
    user_id = ma.auto_field()
    message = ma.auto_field()
    sender = ma.auto_field()
    timestamp = ma.auto_field()


# Export convenience instances
user_schema = UserSchema()
users_schema = UserSchema(many=True)
chat_schema = ChatSchema()
chats_schema = ChatSchema(many=True)

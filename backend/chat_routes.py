"""Chat blueprint: CRUD operations and Gemini integration.

Routes implemented (JSON responses only):
- POST /chat            -> send message to Aira (Gemini), save both user and aira messages
- POST /chat/create     -> create a chat record (protected)
- GET  /chat/<user_id>  -> read user's chat history (protected)
- PUT  /chat/update/<chat_id> -> update chat message (protected)
- DELETE /chat/delete/<chat_id> -> delete a chat record (protected)
- DELETE /chat/clear/<user_id> -> delete all user's chats (protected)

All protected routes use JWT Bearer tokens.
"""
import os
import requests
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, User, Chat, chat_schema, chats_schema

chat_bp = Blueprint('chat', __name__)


def detect_sentiment(text: str) -> str:
    """Simple sentiment detection.

    Import TextBlob lazily to avoid heavy imports at module load time
    (TextBlob brings NLTK and other large deps). If TextBlob is not
    available or fails, return 'neutral' as a safe default.
    """
    try:
        # Lazy import to avoid expensive startup cost
        from textblob import TextBlob

        polarity = TextBlob(text).sentiment.polarity
        if polarity > 0.1:
            return 'positive'
        if polarity < -0.1:
            return 'negative'
        return 'neutral'
    except Exception:
        return 'neutral'


def get_gemini_response(user_message: str) -> dict:
    """Call the Gemini API to generate a reply.

    This implementation uses a configurable `GEMINI_API_URL` and
    `GEMINI_API_KEY` from environment variables to keep the code
    provider-agnostic. Adjust the payload/response parsing to match the
    specific Gemini product you have access to.
    """
    api_url = os.getenv('GEMINI_API_URL')
    api_key = os.getenv('GEMINI_API_KEY')
    provider = os.getenv('GEMINI_PROVIDER', '').lower()
    model = os.getenv('GEMINI_MODEL', 'gemini-2.0-flash')
    api_version = os.getenv('GEMINI_API_VERSION', 'v1beta')

    # If API URL not provided but API key present, try to infer Google GL endpoint
    if not api_url and api_key:
        if provider == 'google' or (isinstance(api_key, str) and api_key.startswith('AIza')):
            api_url = f'https://generativelanguage.googleapis.com/{api_version}/models/{model}:generateContent'

    # If neither URL nor key are available, fall back to local echo (dev mode)
    if not api_url and not api_key:
        return {'reply': f"I heard: {user_message}", 'meta': {'source': 'local-echo'}}

    # Build headers and payload depending on the provider/endpoint
    if api_url and 'generativelanguage.googleapis.com' in api_url:
        # Google Generative Language expects X-goog-api-key and `contents` payload
        headers = {
            'X-goog-api-key': api_key,
            'Content-Type': 'application/json',
        }
        payload = {
            'contents': [
                {'parts': [{'text': user_message}]}
            ]
        }
    else:
        # Generic provider (Bearer token expected)
        headers = {
            'Authorization': f'Bearer {api_key}' if api_key else None,
            'Content-Type': 'application/json',
        }
        # Clean None
        headers = {k: v for k, v in headers.items() if v}
        payload = {
            'input': user_message,
            'temperature': float(os.getenv('GEMINI_TEMPERATURE', '0.7')),
            'max_output_tokens': int(os.getenv('GEMINI_MAX_TOKENS', '512')),
        }

    def _stringify_id_fields(obj):
        """Recursively convert numeric id-like fields to strings.

        This helps when the API expects string identifiers (common in
        some Google endpoints where 'subject' or 'id' must be strings).
        """
        if isinstance(obj, dict):
            new = {}
            for k, v in obj.items():
                if (k == 'id' or k == 'subject' or k.endswith('_id')) and isinstance(v, (int,)):
                    new[k] = str(v)
                else:
                    new[k] = _stringify_id_fields(v)
            return new
        if isinstance(obj, list):
            return [_stringify_id_fields(x) for x in obj]
        return obj

    payload = _stringify_id_fields(payload)

    try:
        # Log the call (do not log API key)
        try:
            current_app.logger.info('Calling Gemini API at %s', api_url)
        except Exception:
            pass

        resp = requests.post(api_url, headers=headers, json=payload, timeout=15)
        resp.raise_for_status()
        data = resp.json()

        # Try common keys; adapt as needed for your Gemini product
        reply = data.get('reply') or data.get('output') or data.get('text')
        if not reply:
            # Some APIs return nested structures
            if isinstance(data.get('candidates'), list) and len(data['candidates']) > 0:
                reply = data['candidates'][0].get('content') or data['candidates'][0]

        return {'reply': reply or 'Sorry — I could not parse the AI response.', 'meta': data}

    except Exception as exc:
        # Log exception server-side for easier debugging (no secrets)
        try:
            current_app.logger.exception('Gemini API call failed')
        except Exception:
            pass
        # Do not crash the entire request if Gemini fails; return friendly message
        return {
            'reply': "Aira is having trouble reaching the AI service right now. Please try again later.",
            'error': str(exc),
        }


@chat_bp.route('/debug/gemini', methods=['GET'])
def debug_gemini():
    """Lightweight endpoint to check Gemini connectivity and config.

    Returns whether GEMINI_API_URL and GEMINI_API_KEY are configured and a
    short attempt to call the endpoint. This endpoint is intentionally
    unprotected to make local debugging easier; do not expose it in
    production without proper controls.
    """
    api_url = os.getenv('GEMINI_API_URL')
    api_key = os.getenv('GEMINI_API_KEY')
    provider = os.getenv('GEMINI_PROVIDER', '').lower()
    model = os.getenv('GEMINI_MODEL', 'gemini-2.0-flash')
    api_version = os.getenv('GEMINI_API_VERSION', 'v1beta')

    # Infer Google endpoint if key present but URL missing
    if not api_url and api_key:
        if provider == 'google' or (isinstance(api_key, str) and api_key.startswith('AIza')):
            api_url = f'https://generativelanguage.googleapis.com/{api_version}/models/{model}:generateContent'

    if not api_url or not api_key:
        return jsonify({'ok': False, 'reason': 'GEMINI_API_URL or GEMINI_API_KEY not set'}), 400

    if 'generativelanguage.googleapis.com' in api_url:
        headers = {'X-goog-api-key': api_key, 'Content-Type': 'application/json'}
        test_payload = {'contents': [{'parts': [{'text': 'ping'}]}]}
    else:
        headers = {'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'}
        test_payload = {'input': 'ping', 'temperature': 0.0, 'max_output_tokens': 16}

    try:
        resp = requests.post(api_url, headers=headers, json=test_payload, timeout=10)
        status = resp.status_code
        try:
            body = resp.json()
        except Exception:
            body = {'text': resp.text[:200]}
        return jsonify({'ok': True, 'status_code': status, 'body_preview': body}), 200
    except Exception as exc:
        try:
            current_app.logger.exception('Gemini debug call failed')
        except Exception:
            pass
        return jsonify({'ok': False, 'error': str(exc)}), 502


@chat_bp.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    """Main chat endpoint: takes user message, calls Gemini, stores both messages.

    Request body: { message: str }
    Returns: { aira_reply, sentiment, user_message, chat_records }
    """
    try:
        data = request.get_json() or {}
        message = (data.get('message') or '').strip()
        if not message:
            return jsonify({'error': 'message is required'}), 400

        user_id = get_jwt_identity()
        try:
            user_id = int(user_id)
        except Exception:
            pass
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Optional sentiment analysis
        sentiment = detect_sentiment(message)

        # Save user's message
        user_chat = Chat(user_id=user.id, message=message, sender='user')
        db.session.add(user_chat)
        db.session.commit()

        # Call Gemini
        ai_resp = get_gemini_response(message)
        aira_reply = ai_resp.get('reply') if isinstance(ai_resp, dict) else str(ai_resp)

        # Save Aira's reply
        aira_chat = Chat(user_id=user.id, message=aira_reply, sender='aira')
        db.session.add(aira_chat)
        db.session.commit()

        # Return both saved records
        return jsonify({
            'user_message': user_chat.to_dict(),
            'aira_reply': aira_chat.to_dict(),
            'sentiment': sentiment,
            'ai_meta': ai_resp.get('meta') if isinstance(ai_resp, dict) else None,
        }), 200

    except Exception as exc:
        db.session.rollback()
        return jsonify({'error': 'Chat processing failed', 'details': str(exc)}), 500


@chat_bp.route('/chat/create', methods=['POST'])
@jwt_required()
def create_chat():
    """Create an arbitrary chat record for the authenticated user.

    Body: { message, sender }
    """
    try:
        data = request.get_json() or {}
        message = (data.get('message') or '').strip()
        sender = (data.get('sender') or 'user').strip()

        if not message or sender not in ('user', 'aira'):
            return jsonify({'error': 'message and valid sender (user|aira) are required'}), 400

        user_id = get_jwt_identity()
        chat = Chat(user_id=user_id, message=message, sender=sender)
        db.session.add(chat)
        db.session.commit()

        return jsonify({'chat': chat.to_dict()}), 201

    except Exception as exc:
        db.session.rollback()
        return jsonify({'error': 'Failed to create chat', 'details': str(exc)}), 500


@chat_bp.route('/chat/<int:user_id>', methods=['GET'])
@jwt_required()
def get_history(user_id: int):
    """Get chat history for a user. Only allowed if the JWT identity matches user_id."""
    requester = get_jwt_identity()
    try:
        requester = int(requester)
    except Exception:
        pass
    if requester != user_id:
        return jsonify({'error': 'Forbidden'}), 403

    chats = Chat.query.filter_by(user_id=user_id).order_by(Chat.timestamp.asc()).all()
    return jsonify({'history': [c.to_dict() for c in chats], 'length': len(chats)}), 200


@chat_bp.route('/chat/update/<int:chat_id>', methods=['PUT'])
@jwt_required()
def update_chat(chat_id: int):
    """Update a chat message. Only the owner may update their chat entries."""
    try:
        user_id = get_jwt_identity()
        try:
            user_id = int(user_id)
        except Exception:
            pass
        chat = Chat.query.get(chat_id)
        if not chat:
            return jsonify({'error': 'Chat not found'}), 404
        if chat.user_id != user_id:
            return jsonify({'error': 'Forbidden'}), 403

        data = request.get_json() or {}
        message = data.get('message')
        if not message:
            return jsonify({'error': 'message is required'}), 400

        chat.message = message
        db.session.commit()
        return jsonify({'chat': chat.to_dict()}), 200

    except Exception as exc:
        db.session.rollback()
        return jsonify({'error': 'Failed to update chat', 'details': str(exc)}), 500


@chat_bp.route('/chat/delete/<int:chat_id>', methods=['DELETE'])
@jwt_required()
def delete_chat(chat_id: int):
    try:
        user_id = get_jwt_identity()
        try:
            user_id = int(user_id)
        except Exception:
            pass
        chat = Chat.query.get(chat_id)
        if not chat:
            return jsonify({'error': 'Chat not found'}), 404
        if chat.user_id != user_id:
            return jsonify({'error': 'Forbidden'}), 403

        db.session.delete(chat)
        db.session.commit()
        return jsonify({'status': 'deleted'}), 200

    except Exception as exc:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete chat', 'details': str(exc)}), 500


@chat_bp.route('/chat/clear/<int:user_id>', methods=['DELETE'])
@jwt_required()
def clear_chats(user_id: int):
    requester = get_jwt_identity()
    try:
        requester = int(requester)
    except Exception:
        pass
    if requester != user_id:
        return jsonify({'error': 'Forbidden'}), 403
    try:
        deleted = Chat.query.filter_by(user_id=user_id).delete()
        db.session.commit()
        return jsonify({'status': 'cleared', 'deleted': deleted}), 200
    except Exception as exc:
        db.session.rollback()
        return jsonify({'error': 'Failed to clear chats', 'details': str(exc)}), 500

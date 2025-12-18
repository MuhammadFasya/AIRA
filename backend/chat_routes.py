"""Chat blueprint: CRUD operations and AI integration (Groq/Gemini).

Routes implemented (JSON responses only):
- POST /chat            -> send message to Aira (AI), save both user and aira messages
- POST /chat/create     -> create a chat record (protected)
- GET  /chat/<user_id>  -> read user's chat history (protected)
- PUT  /chat/update/<chat_id> -> update chat message (protected)
- DELETE /chat/delete/<chat_id> -> delete a chat record (protected)
- DELETE /chat/clear/<user_id> -> delete all user's chats (protected)

All protected routes use JWT Bearer tokens.

AI Provider Support:
- Groq (recommended): Fast inference with generous free tier (14,400 RPD)
- Google Gemini: Fallback option with lower free tier limits
"""
import os
import time
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
    """Call the AI API to generate a reply.

    Supports multiple AI providers through configurable environment variables:
    - GEMINI_API_KEY: Your API key (Groq starts with 'gsk_', Google starts with 'AIza')
    - GEMINI_PROVIDER: 'groq' or 'google' (auto-detected from API key format)
    - GEMINI_MODEL: Model name (default: 'llama-3.3-70b-versatile' for Groq)
    - GEMINI_API_URL: Optional override for API endpoint (auto-detected)
    
    Groq Configuration (Recommended):
        GEMINI_API_KEY=gsk_your_key_here
        GEMINI_PROVIDER=groq
        GEMINI_MODEL=llama-3.3-70b-versatile
        
    Returns a dict with 'reply' key containing the AI response.
    """
    api_url = os.getenv('GEMINI_API_URL')
    api_key = os.getenv('GEMINI_API_KEY')
    provider = os.getenv('GEMINI_PROVIDER', '').lower()
    model = os.getenv('GEMINI_MODEL', 'llama-3.3-70b-versatile')
    api_version = os.getenv('GEMINI_API_VERSION', 'v1beta')

    # Auto-detect provider from API key if not explicitly set
    if not provider and api_key:
        if isinstance(api_key, str):
            if api_key.startswith('gsk_'):
                provider = 'groq'
            elif api_key.startswith('AIza'):
                provider = 'google'

    # Infer API URL based on provider
    if not api_url and api_key:
        if provider == 'groq':
            api_url = 'https://api.groq.com/openai/v1/chat/completions'
        elif provider == 'google' or (isinstance(api_key, str) and api_key.startswith('AIza')):
            api_url = f'https://generativelanguage.googleapis.com/{api_version}/models/{model}:generateContent'

    # If neither URL nor key are available, fall back to local echo (dev mode)
    if not api_url and not api_key:
        return {'reply': f"I heard: {user_message}", 'meta': {'source': 'local-echo'}}

    # System prompt to define Aira's personality and behavior
    system_instruction = """You are Aira, a compassionate and empathetic mental health support AI designed specifically for Gen-Z students. Your purpose is to:

1. Listen actively and provide emotional support
2. Help users process their feelings and thoughts
3. Offer coping strategies and mental wellness tips
4. Be warm, understanding, and non-judgmental
5. Use casual, friendly language that resonates with Gen-Z
6. Recognize when someone needs professional help and suggest it appropriately

When asked "who are you" or similar questions, introduce yourself as: "I'm Aira, your mental health companion. I'm here to listen, support, and help you navigate your feelings and challenges. Think of me as a friendly ear whenever you need someone to talk to."

Always be supportive, never dismissive, and maintain a safe, confidential space for conversations."""

    # Build headers and payload depending on the provider/endpoint
    if provider == 'groq' or (api_url and 'groq.com' in api_url):
        # Groq uses OpenAI-compatible format
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        }
        payload = {
            'model': model,
            'messages': [
                {'role': 'system', 'content': system_instruction},
                {'role': 'user', 'content': user_message}
            ],
            'temperature': float(os.getenv('GEMINI_TEMPERATURE', '0.7')),
            'max_tokens': int(os.getenv('GEMINI_MAX_TOKENS', '512')),
        }
    elif api_url and 'generativelanguage.googleapis.com' in api_url:
        # Google Generative Language expects X-goog-api-key and `contents` payload
        headers = {
            'X-goog-api-key': api_key,
            'Content-Type': 'application/json',
        }
        
        # System prompt to define Aira's personality and behavior
        system_instruction = """You are Aira, a compassionate and empathetic mental health support AI designed specifically for Gen-Z students. Your purpose is to:

1. Listen actively and provide emotional support
2. Help users process their feelings and thoughts
3. Offer coping strategies and mental wellness tips
4. Be warm, understanding, and non-judgmental
5. Use casual, friendly language that resonates with Gen-Z
6. Recognize when someone needs professional help and suggest it appropriately

When asked "who are you" or similar questions, introduce yourself as: "I'm Aira, your mental health companion. I'm here to listen, support, and help you navigate your feelings and challenges. Think of me as a friendly ear whenever you need someone to talk to."

Always be supportive, never dismissive, and maintain a safe, confidential space for conversations."""

        payload = {
            'system_instruction': {
                'parts': [{'text': system_instruction}]
            },
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
            current_app.logger.info('Calling AI API (%s) at %s', provider or 'auto', api_url)
        except Exception:
            pass

        # Retry logic for rate limiting (429 errors)
        max_retries = 3
        retry_delay = 2  # seconds
        
        for attempt in range(max_retries):
            try:
                resp = requests.post(api_url, headers=headers, json=payload, timeout=15)
                resp.raise_for_status()
                data = resp.json()
                break  # Success! Exit retry loop
                
            except requests.exceptions.HTTPError as http_err:
                # Check if it's a 429 rate limit error
                if resp.status_code == 429 and attempt < max_retries - 1:
                    # Calculate exponential backoff: 2s, 4s, 8s
                    wait_time = retry_delay * (2 ** attempt)
                    try:
                        current_app.logger.warning(
                            f'Rate limit hit (429). Retrying in {wait_time}s... (attempt {attempt + 1}/{max_retries})'
                        )
                    except Exception:
                        pass
                    time.sleep(wait_time)
                    continue  # Retry
                else:
                    # Not a 429 or max retries reached
                    raise http_err
        else:
            # This only executes if we never broke out of the loop (all retries failed)
            raise Exception('Max retries reached for AI API')

        # Try common keys; adapt as needed for different AI providers
        reply = None
        
        # Groq/OpenAI format: choices[0].message.content
        if isinstance(data.get('choices'), list) and len(data['choices']) > 0:
            message = data['choices'][0].get('message', {})
            reply = message.get('content')
        
        # Fallback to common keys
        if not reply:
            reply = data.get('reply') or data.get('output') or data.get('text')
        
        # Google Gemini format: candidates[0].content.parts[0].text
        if not reply:
            if isinstance(data.get('candidates'), list) and len(data['candidates']) > 0:
                content = data['candidates'][0].get('content')
                if content:
                    # Extract text from parts array
                    if isinstance(content, dict) and 'parts' in content:
                        parts = content.get('parts', [])
                        if parts and isinstance(parts, list) and len(parts) > 0:
                            reply = parts[0].get('text', '')
                    else:
                        reply = content
                else:
                    reply = data['candidates'][0]

        return {'reply': reply or 'Sorry — I could not parse the AI response.', 'meta': data}

    except Exception as exc:
        # Log exception server-side for easier debugging (no secrets)
        try:
            current_app.logger.exception('AI API call failed')
        except Exception:
            pass
        # Do not crash the entire request if AI fails; return friendly message
        return {
            'reply': "Aira is having trouble reaching the AI service right now. Please try again in a moment.",
            'error': str(exc),
        }


@chat_bp.route('/debug/ai', methods=['GET'])
@chat_bp.route('/debug/gemini', methods=['GET'])  # Legacy route for backward compatibility
def debug_ai():
    """Lightweight endpoint to check AI API connectivity and config.

    Tests the connection to your configured AI provider (Groq or Google Gemini).
    Returns configuration status and a test API call result.
    
    Access via: /debug/ai or /debug/gemini (legacy)
    
    This endpoint is intentionally unprotected to make local debugging easier;
    consider adding authentication in production environments.
    """
    api_url = os.getenv('GEMINI_API_URL')
    api_key = os.getenv('GEMINI_API_KEY')
    provider = os.getenv('GEMINI_PROVIDER', '').lower()
    model = os.getenv('GEMINI_MODEL', 'llama-3.3-70b-versatile')
    api_version = os.getenv('GEMINI_API_VERSION', 'v1beta')

    # Auto-detect provider from API key
    if not provider and api_key:
        if isinstance(api_key, str):
            if api_key.startswith('gsk_'):
                provider = 'groq'
            elif api_key.startswith('AIza'):
                provider = 'google'

    # Infer API URL based on provider
    if not api_url and api_key:
        if provider == 'groq':
            api_url = 'https://api.groq.com/openai/v1/chat/completions'
        elif provider == 'google' or (isinstance(api_key, str) and api_key.startswith('AIza')):
            api_url = f'https://generativelanguage.googleapis.com/{api_version}/models/{model}:generateContent'

    if not api_url or not api_key:
        return jsonify({'ok': False, 'reason': 'GEMINI_API_URL or GEMINI_API_KEY not set'}), 400

    # Build test payload based on provider
    if provider == 'groq' or (api_url and 'groq.com' in api_url):
        headers = {'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'}
        test_payload = {
            'model': model,
            'messages': [{'role': 'user', 'content': 'ping'}],
            'temperature': 0.0,
            'max_tokens': 16
        }
    elif 'generativelanguage.googleapis.com' in api_url:
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
        return jsonify({
            'ok': True, 
            'provider': provider or 'auto-detected',
            'model': model,
            'status_code': status, 
            'body_preview': body
        }), 200
    except Exception as exc:
        try:
            current_app.logger.exception('AI API debug call failed')
        except Exception:
            pass
        return jsonify({'ok': False, 'error': str(exc)}), 502


@chat_bp.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    """Main chat endpoint: takes user message, calls AI, stores both messages.

    Request body: { message: str }
    Returns: { response: str, sentiment: str, history_length: int }
    
    The AI response is generated by Groq (or configured AI provider) and both
    the user's message and Aira's reply are stored in the database.
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

        # Call AI provider (Groq/Gemini)
        ai_resp = get_gemini_response(message)
        aira_reply = ai_resp.get('reply') if isinstance(ai_resp, dict) else str(ai_resp)

        # Save Aira's reply
        aira_chat = Chat(user_id=user.id, message=aira_reply, sender='aira')
        db.session.add(aira_chat)
        db.session.commit()

        # Count chat history for this user
        history_count = Chat.query.filter_by(user_id=user.id).count()

        # Return simplified response for frontend
        response_data = {
            'response': aira_reply,
            'sentiment': sentiment,
            'history_length': history_count,
        }
        return jsonify(response_data), 200

    except Exception as exc:
        # Log error server-side for debugging
        try:
            current_app.logger.error(f'Chat endpoint error: {exc}')
        except Exception:
            pass
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

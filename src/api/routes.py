from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import app, db
from models import User, Event

# Create a Blueprint for authentication routes
auth_bp = Blueprint("auth", __name__)

# User Registration
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'message': 'Username already exists'}), 400

    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

# User Login
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or user.password != password:
        return jsonify({'message': 'Invalid username or password'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200

# Protected route for viewing events
@auth_bp.route('/view_events', methods=['GET'])
@jwt_required()
def view_events():
    events = Event.query.all()
    # Implement logic to fetch and return events data from the database
    event_data = [{'title': event.title, 'description': event.description} for event in events]
    return jsonify({'events': event_data}), 200

# ... Define other routes and views for registration, login, event details, etc.


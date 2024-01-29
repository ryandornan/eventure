"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from models import User, Event
from app import bcrypt

# Create a Blueprint for the routes
events_bp = Blueprint('events', __name__)

@events_bp.route('/api/create_event', methods=['POST'])
@jwt_required()
def create_event():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user and current_user.is_promoter:
        data = request.json
        title = data.get('title')
        location = data.get('location')
        ticket_price = data.get('ticket_price')
        category = data.get('category')

        new_event = Event(title=title, location=location, ticket_price=ticket_price, category=category, promoter=current_user)
        db.session.add(new_event)
        db.session.commit()

        return jsonify({'message': 'Event created successfully'}), 201
    else:
        return jsonify({'message': 'Permission denied'}), 403

# Create another Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')
    is_promoter = data.get('is_promoter', False)

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email is already registered'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(first_name=first_name, last_name=last_name, email=email,
                    password=hashed_password, is_promoter=is_promoter)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id, expires_delta=False)
        return jsonify({'access_token': access_token, 'is_promoter': user.is_promoter}), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401

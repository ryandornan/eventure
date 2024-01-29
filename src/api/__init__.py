from flask import Flask, render_template
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
CORS(app)

# Configure Flask app
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # Token doesn't expire for simplicity

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Create a Blueprint for the routes
events_bp = Blueprint('events', __name__)

# Import models
from models import User, Event

# Event creation route
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

        new_event = Event(
            title=title,
            location=location,
            ticket_price=ticket_price,
            category=category,
            promoter=current_user
        )
        db.session.add(new_event)
        db.session.commit()

        return jsonify({'message': 'Event created successfully'}), 201
    else:
        return jsonify({'message': 'Permission denied'}), 403

# User registration route
@events_bp.route('/api/register', methods=['POST'])
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

# User login route
@events_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token, 'is_promoter': user.is_promoter}), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401

# Register the Blueprint
app.register_blueprint(events_bp)

# Render the contact form page
@app.route('/contact', methods=['GET'])
def contact_form_page():
    return render_template('contact_form.html')

if __name__ == '__main__':
    # Create tables if not exist
    db.create_all()
    app.run(debug=True)


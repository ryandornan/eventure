"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

#LogIn Route 

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        # Authentication successful
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Login failed"}), 401
    
#SignUp Route 

@api.route('/sign-up', methods=['POST'])
def signup():
    try:
        data = request.json

        # Extract data from the request
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        password = data.get('password')

        # Validate the data
        if not all([first_name, last_name, email, password]):
            raise APIException("All fields are required", status_code=400)

        # Check if the email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            raise APIException("Email already exists", status_code=400)

        # Create a new user
        hashed_password = generate_password_hash(password, method='sha256')
        new_user = User(first_name=first_name, last_name=last_name, email=email, password=hashed_password)

        # Add the new user to the database
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'Signup successful'}), 201

    except APIException as e:
        return jsonify({"message": str(e)}), e.status_code

    except Exception as e:
        return jsonify({"message": "Internal Server Error"}), 500

#Event Route 

@api.route('/create-event', methods=['POST'])
def create_event():
    data = request.json

    # Event model with appropriate fields (name, description, location, date, price, image)

    new_event = Event(
        name=data['name'],
        description=data['description'],
        location=data['location'],
        date=data['date'],
        price=data['price'],
        image=data['image']
    )

    # Save to database or perform any required actions
    # For example: db.session.add(new_event)
    #               db.session.commit()

    return jsonify({'message': 'Event created successfully'}), 201
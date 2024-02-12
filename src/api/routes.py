"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Event,TicketPurchase
from api.utils import generate_sitemap, APIException
from flask_cors import CORS 
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from dotenv import load_dotenv
import stripe


#Create flask app
api = Blueprint('api', __name__)

load_dotenv()  # Load environment variables from a .env file

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# Allow CORS requests to this API
CORS(api)

# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.

@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email != email or password != password:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)


@api.route('/hello', methods=['POST', 'GET'])

#TO PROTECT THE ROUTE USE JWT REQUIRED ***************

def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the Google Inspector, and you will see the GET request"
    }

    return jsonify(response_body), 200
    
##### SignUp Route ######

@api.route('/sign-up', methods=['POST'])
def sign_up():
    try:
        # Parse and validate the incoming JSON data
        data = request.json
        required_fields = ['firstName', 'lastName', 'email', 'password']
        for field in required_fields:
            if field not in data:
                raise APIException(f"Missing {field} in request body", status_code=400)

        # Check if the user already exists in the database
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            raise APIException("User with this email already exists", status_code=400)

        # Create a new user and save it to the database
        new_user = User(
            first_name=data['firstName'],
            last_name=data['lastName'],
            email=data['email'],
            password=data['password']
        )
        db.session.add(new_user)
        db.session.commit()

        # Generate JWT token for the new user
        access_token = create_access_token(identity=data['email'])

        # Return success message and token
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token
        }), 201

    except Exception as e:
        # Handle any exceptions and return an error message
        return jsonify({'error': str(e)}), 500
    
#Get All Events Route ######

@api.route('/events', methods=['GET'])
def get_events():
    # Get all events from the database
    events = Event.query.all()

    # Format events data for response
    event_list = []
    for event in events:
        event_data = {
            'id': event.id,
            'name': event.name,
            'description': event.description,
            'location': event.location,
        #    'date': event.date.strftime('%Y-%m-%d %H:%M:%S'),  # Format date as string
            'date': event.date,  # Format date as string
            'price': event.price,
            'image': event.image
        }
        event_list.append(event_data)

    # Return events data
    return jsonify({'events': event_list}), 200

# Get Single Event Route #

@api.route('/event/<int:event_id>', methods=['GET'])
def get_event(event_id):
    # Query the database for the event with the provided ID
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'message': 'Event not found'}), 404

    # Format event data for response
    event_data = {
        'id': event.id,
        'name': event.name,
        'description': event.description,
        'location': event.location,
        'date': event.date,  # Assuming you want to send the date as is
        'price': event.price,
        'image': event.image
    }

    # Return event data
    return jsonify({'event': event_data}), 200

# Create Event Route #

@api.route('/create-event', methods=['POST'])
def create_event():
    data = request.json

    new_event = Event(
        name=data['name'],
        description=data['description'],
        location=data['location'],
        date=data['date'],
        price=data['price'],
        image=data['image']
    )

    # Save event to database 
    db.session.add(new_event)
    db.session.commit()

    return jsonify({'message': 'Event created successfully'}), 201

# Edit Event Route #

@api.route('/edit-event/<int:event_id>', methods=['PATCH'])
def edit_event(event_id):
    data = request.json

    event = Event.query.get(event_id)
    if not event:
        return jsonify({'message': 'Event not found'}), 404

    # Update event fields if provided in the request data
    if 'name' in data:
        event.name = data['name']
    if 'description' in data:
        event.description = data['description']
    if 'location' in data:
        event.location = data['location']
    if 'date' in data:
        event.date = data['date']
    if 'price' in data:
        event.price = data['price']
    if 'image' in data:
        event.image = data['image']

    # Commit changes to the database
    db.session.commit()

    return jsonify({'message': 'Event updated successfully'}), 200


# Delete Event Route #

@api.route('/delete-event/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'message': 'Event not found'}), 404

    # Delete the event from the database
    db.session.delete(event)
    db.session.commit()

    return jsonify({'message': 'Event deleted successfully'}), 200



@api.route('/checkout', methods=['POST'])
def checkout():
    data = request.json
    event_id = data.get('event_id')
    quantity = data.get('quantity')
    user_email = data.get('email')  # Assuming the client sends the user's email
    
    # Find the event to get the price
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'message': 'Event not found'}), 404

    # Calculate the total price in cents
    total_price = int(event.price * quantity * 100)  # Stripe expects amount in cents

    try:
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=total_price,
            currency='usd',
            description=f'Tickets for {event.name}',
            receipt_email=user_email,
        )

        return jsonify({'clientSecret': intent.client_secret}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/webhook', methods=['POST'])
def stripe_webhook():
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv('STRIPE_ENDPOINT_SECRET')
        )

        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            handle_payment_success(payment_intent)
        else:
            return jsonify({'message': 'Unhandled event type'}), 400
    except ValueError:
        # Invalid payload
        return 'Invalid payload', 400
    except stripe.error.SignatureVerificationError:
        # Invalid signature
        return 'Invalid signature', 400

    return jsonify({'message': 'Success'}), 200

def handle_payment_success(payment_intent):
    # Here you could update your database to mark the tickets as paid
    print(f"Payment for {payment_intent['amount']} succeeded.")

@api.route('/search', methods=['GET'], endpoint='search_get')
def search_get():
    # Your search logic for GET request
    query = request.args.get('query', '')
    if query:
        # Replace 'Event.query' with your actual query logic
        events = Event.query.filter(Event.name.ilike(f'%{query}%')).all()
        return jsonify({'events': [event.to_dict() for event in events]})
    else:
        return jsonify({'message': 'No query provided'}), 400

@api.route('/search', methods=['POST'])
def search_by_tag():
    # Get the tag from the form data
    tag = request.form["tag"]
    
    # Create the search pattern
    search = "%{}%".format(tag)
    
    # Perform the query using the like operator
    posts = Event.query.filter(Event.tags.like(search)).all()
    
    # Convert the posts to a list of dictionaries (assuming a to_dict method exists on the Post model)
    results = [Event.to_dict() for Event in Event]
    
    # Return the search results as JSON
    return jsonify(results), 200



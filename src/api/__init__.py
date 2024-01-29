from flask import Flask, render_template
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
CORS(app)

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Create a Blueprint for the routes
events_bp = Blueprint('events', __name__)

# Import models (import them before creating tables)
from models import User, Event

# Create tables if not exist
db.create_all()

if __name__ == '__main__':
    app.run(debug=True)

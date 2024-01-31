from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask import Blueprint
from routes import  # Adjust import path based on your project structure

app = Flask(__name__)
CORS(app)

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Import models (import them before creating tables)
from models import User, Event

# Create tables if not exist
db.create_all()

# Import and register blueprints from the routes module
from event_page.routes import events_bp, auth_bp  # Adjust import path based on your project structure

app.register_blueprint(events_bp, url_prefix='/events')
app.register_blueprint(auth_bp, url_prefix='/auth')

# Handle database migrations
from flask_migrate import Migrate
migrate = Migrate(app, db)

if __name__ == '__main__':
    app.run(debug=True)


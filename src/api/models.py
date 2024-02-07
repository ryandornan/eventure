from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(120), unique=True, nullable=False)
    last_name = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(250), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    date = db.Column(db.String(10), nullable=False)  # Adjust as needed
    price = db.Column(db.String(50), nullable=False)
    image = db.Column(db.String(255))  # Assuming you store file paths, adjust as needed


db = SQLAlchemy()

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # connection with the user
    amount = db.Column(db.Integer, nullable=False)  # is a Float it should be multiply by 100
    #currency = db.Column(db.String(3), nullable=False)  #Corrency codes: USD, EUR
    #neecx to be created 
    status = db.Column(db.String(50), nullable=False)  # e.g., 'succeeded', 'pending', 'failed'
    transaction_id = db.Column(db.String(255), unique=True, nullable=True)  # Stripe or PayPal transaction ID
    #created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        #Currency: {self.currency} add it if necessary
        return f"<Payment {self.id}, Amount: {self.amount}, Status: {self.status}>"
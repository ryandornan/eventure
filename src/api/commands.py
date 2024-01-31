import click
from app import app, db  # Import 'app' and 'db' from your main application
from models import User

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator.
Flask commands are useful to run cron jobs or tasks outside of the API but still in integration
with your database, for example: Import the price of bitcoin every night at 12 AM.
"""

def setup_commands(app):
    
    @app.cli.command("insert-test-users")  # name of our command
    @click.argument("count")  # argument of our command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.username = "test_user" + str(x)
            user.password = "123456"  # Note: In a production app, you should hash the passwords
            db.session.add(user)
            db.session.commit()
            print("User: ", user.username, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        # Implement logic to insert test data as needed
        pass

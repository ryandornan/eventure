import os
from flask_admin import Admin
from .models import db, User, Event , ContactSubmission
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    # Add your models here
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Event, db.session)) 
    admin.add_view(ModelView(ContactSubmission, db.session))
     # Add the Event model to the admin

    # You can duplicate the ModelView line to add more models if needed
    # admin.add_view(ModelView(YourModelName, db.session))

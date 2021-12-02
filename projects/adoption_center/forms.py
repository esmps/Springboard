from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TextField, SelectField, BooleanField
from wtforms.validators import InputRequired, Optional, URL, NumberRange

class AddPetForm(FlaskForm):
    """Form for adding pets."""

    name = StringField("Pet Name", validators=[InputRequired()])
    species = SelectField("Pet Species", choices=[('Dog', 'Dog'), ('Cat', 'Cat'), ('Porcupine', 'Porcupine')], validators=[InputRequired()])
    photo_url = StringField("Photo URL", validators=[URL(), Optional()])
    age = IntegerField("Age", validators=[NumberRange(min=0, max=30)])
    notes = TextField("Notes")

class EditPetForm(FlaskForm):
    """ Form for editing pets"""
    photo_url = StringField("Photo URL", validators=[URL(), Optional()])
    notes= TextField("Notes")
    available = BooleanField("Available")


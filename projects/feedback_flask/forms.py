from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField,TextAreaField
from wtforms.validators import InputRequired, Email


class UserCreationForm(FlaskForm):
    username = StringField("Username", validators=[InputRequired("Please enter a username.")])
    password = PasswordField("Password", validators=[InputRequired("Please enter a password.")])
    email = StringField("Email", validators=[InputRequired("Please enter a valid email."), Email("This field requires a valid email address")])
    first_name = StringField("First Name", validators=[InputRequired("Please enter your first name.")])
    last_name = StringField("Last Name", validators=[InputRequired("Please enter your last name.")])

class UserAuthenticateForm(FlaskForm):
    username = StringField("Username", validators=[InputRequired("Please enter your username.")])
    password = PasswordField("Password", validators=[InputRequired("Please enter your password.")])

class FeedbackForm(FlaskForm):
    title = StringField("Feedback Title", validators=[InputRequired()])
    content = TextAreaField("Feedback Text", validators=[InputRequired()])

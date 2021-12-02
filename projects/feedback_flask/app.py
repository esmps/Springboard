from flask import Flask, render_template, redirect, session, flash
from flask_debugtoolbar import DebugToolbarExtension
from models import connect_db, db, User, Feedback
from forms import UserCreationForm, UserAuthenticateForm, FeedbackForm
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///feedback_flask"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True
app.config["SECRET_KEY"] = "abc123"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False


connect_db(app)
debug = DebugToolbarExtension(app)

@app.route('/')
def home_page():
    return redirect('/register')

@app.route('/register', methods=['GET', 'POST'])
def register_user():
    """ Register user """
    form = UserCreationForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        email = form.email.data
        first_name = form.first_name.data
        last_name = form.last_name.data
        new_user = User.register(username, password, email, first_name,last_name)

        db.session.add(new_user)
        try:
            db.session.commit()
        except IntegrityError:
            form.username.errors.append('Username taken. Please pick another')
            return render_template('register.html', form=form)
        session['user_name'] = new_user.username
        flash('Welcome! Successfully Created Your Account!', "success")
        return redirect(f'/users/{new_user.username}')
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login_user():
    """ Login user """
    form = UserAuthenticateForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data

        user = User.authenticate(username, password)
        if user:
            flash(f"Welcome Back, {user.username}!", "primary")
            session['user_name'] = user.username
            return redirect(f'/users/{user.username}')
        else:
            form.username.errors = ['Invalid username/password.']
    return render_template('login.html', form=form)

@app.route('/logout')
def logout_user():
    """ Logout user """
    session.pop('user_name')
    flash("Goodbye!", "info")
    return redirect('/')

@app.route('/users/<username>')
def show_user(username):
    """ Show user """
    if 'user_name' not in session:
        flash("Please login first!", "danger")
        return redirect('/login')
    user = User.query.get_or_404(username)
    feedback = user.feedbacks
    return render_template('user_info.html', user=user, feedback=feedback)

@app.route('/users/<username>/delete', methods=['POST'])
def delete_user(username):
    """ Delete user """
    user = User.query.get_or_404(username)
    if user.username == session['user_name']:
        db.session.delete(user)
        db.session.commit()
        session.pop('user_name')
    else:
        flash("You are not allowed to do that!", "danger")
        return redirect(f'/users/{user.username}')
    return redirect('/')

@app.route('/users/<username>/feedback/add')
def view_feedback_form(username):
    """ Show feedback form """
    user = User.query.get_or_404(username)
    form = FeedbackForm()
    if user.username == session['user_name']:
        return render_template('feedback_form.html', form=form, user=user)
    flash("You are not allowed to do that!", "danger")
    return redirect(f'/users/{user.username}')

@app.route('/users/<username>/feedback/add', methods=['POST'])
def add_feedback(username):
    """ Add feedback from form """
    user = User.query.get_or_404(username)
    form = FeedbackForm()
    if user.username == session['user_name']:
        if form.validate_on_submit():
            title = form.title.data
            content = form.content.data
            new_feedback = Feedback(title=title, content=content, username=session['user_name'])
            db.session.add(new_feedback)
            db.session.commit()
            flash('Feedback Added!', 'success')
            return redirect(f'/users/{user.username}')
    flash("You are not allowed to do that!", "danger")
    return redirect(f'/users/{user.username}')

@app.route('/feedback/<int:feedback_id>/update')
def update_feedback_form(feedback_id):
    """ Show update feedback form """
    feedback = Feedback.query.get_or_404(feedback_id)
    if feedback.username == session['user_name']:
        form = FeedbackForm(obj=feedback)
        return render_template("feedback_form.html", form=form)
    flash("You are not allowed to do that!", "danger")
    return redirect(f'/users/{feedback.user.username}')

@app.route('/feedback/<int:feedback_id>/update', methods=["POST"])
def update_feedback(feedback_id):
    """Edit feedback and redirect to user."""
    feedback = Feedback.query.get_or_404(feedback_id)
    form = FeedbackForm()
    if feedback.user.username == session['user_name']:
        if form.validate_on_submit():
            feedback.title = form.title.data
            feedback.content = form.content.data
            db.session.add(feedback)
            db.session.commit()
            flash('Feedback updated!', 'success')
            return redirect(f'/users/{feedback.user.username}')
    flash("You are not allowed to do that!", "danger")
    return redirect(f'/users/{feedback.user.username}')

@app.route('/feedback/<int:id>/delete', methods=["POST"])
def delete_feedback(id):
    """Delete feedback"""
    if 'user_name' not in session:
        flash("Please login first!", "danger")
        return redirect('/login')
    feedback = Feedback.query.get_or_404(id)
    if feedback.username == session['user_name']:
        db.session.delete(feedback)
        db.session.commit()
        flash("Feedback deleted!", "info")
        return redirect(f'/users/{feedback.username}')
    flash("You are not allowed to do that!", "danger")
    return redirect(f'/users/{feedback.user.username}')

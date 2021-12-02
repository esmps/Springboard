"""Blogly application."""

from flask import Flask, request, redirect, render_template
from models import db, connect_db, User, Post, Tag, PostTag
import datetime


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
db.create_all()

# from flask_debugtoolbar import DebugToolbarExtension
# app.config['SECRET_KEY'] = "SECRET!"
# debug = DebugToolbarExtension(app)


################### USER ROUTES ####################

@app.route("/")
def home_page():
    """ Redirect to users route """
    return redirect("/users")

@app.route("/users")
def list_users():
    """List users and show add button."""

    users = User.query.all()
    return render_template("users.html", users=users)

@app.route("/users/new")
def add_user_form():
    """Show add user form"""
    return render_template("add_user.html")

@app.route("/users/new", methods=["POST"])
def add_user():
    """Add user and redirect to list."""

    first_name = request.form['first_name']
    last_name = request.form['last_name']
    if request.form['image_url']:
        image_url = request.form['image_url']
    else:
        image_url = None

    user = User(first_name=first_name, last_name=last_name, image_url=image_url)
    db.session.add(user)
    db.session.commit()

    return redirect("/users")

@app.route("/users/<int:user_id>")
def show_user(user_id):
    """Show user information"""

    user = User.query.get_or_404(user_id)
    posts = Post.query.filter_by(user_id = user_id)
    return render_template("user_info.html", user=user, posts = posts)

@app.route("/users/<int:user_id>/edit")
def edit_user_form(user_id):
    """Show edit user form"""

    user = User.query.get_or_404(user_id)
    return render_template("user_edit_info.html", user=user)

@app.route("/users/<int:user_id>/edit", methods=["POST"])
def edit_user(user_id):
    """Edit user and redirect to list."""

    user = User.query.get_or_404(user_id)
    user.first_name = request.form['first_name']
    user.last_name = request.form['last_name']
    user.image_url = request.form['image_url'] 

    db.session.add(user)    
    db.session.commit()
    return redirect("/users")

@app.route("/users/<int:user_id>/delete", methods=["POST"])
def delete_user(user_id):
    """Remove user"""

    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return redirect("/users")

################### POSTS ROUTES ####################

@app.route("/users/<int:user_id>/posts/new")
def add_post_form(user_id):
    """ Show new post form"""
     # Get tags
    tags = Tag.query.all()
    return render_template("add_post.html",tags=tags)

@app.route("/users/<int:user_id>/posts/new", methods=["POST"])
def add_post(user_id):
    """Add post and redirect to user info page."""

    # Get user
    user = User.query.get_or_404(user_id)
    # Get post information from form
    title = request.form['title']
    content = request.form['content']
    date = datetime.datetime.now()
    created_at = date.strftime("%B %d, %Y")
    # Create post
    post = Post(title=title, content=content, created_at=created_at, user_id=user.id)
    db.session.add(post)
    db.session.commit()
    
    # Get tags
    tags = request.form.getlist('tag')

    for tag in tags:
        tag_id = Tag.query.filter(Tag.name == tag).one()
        post_tag = PostTag(post_id=post.id, tag_id=tag_id.id)
        db.session.add(post_tag)
        db.session.commit()

    return redirect(f"/users/{user_id}")

@app.route("/posts")
def view_all_posts():
    posts = Post.query.all()
    return render_template("posts.html", posts=posts)
    
@app.route("/posts/<int:post_id>")
def view_post(post_id):

    post = Post.query.get_or_404(post_id)
    post_date = post.created_at
    tags = post.posts_tags
    return render_template("post_info.html", post=post, tags=tags)

@app.route("/posts/<int:post_id>/edit")
def edit_post_form(post_id):
    tags = Tag.query.all()
    post = Post.query.get_or_404(post_id)
    return render_template("post_edit_info.html", post=post, tags=tags)

@app.route("/posts/<int:post_id>/edit", methods=["POST"])
def edit_post(post_id):
    """Edit post and redirect to post."""

    post = Post.query.get_or_404(post_id)
    post.title = request.form['title']
    post.content = request.form['content']

    db.session.add(post)
    db.session.commit()
    
    # Get tags
    tags = request.form.getlist('tag')

    for tag in tags:
        tag_id = Tag.query.filter(Tag.name == tag).one()
        post_tag = PostTag(post_id=post.id, tag_id=tag_id.id)
        db.session.add(post_tag)
        db.session.commit()
    return redirect(f"/posts/{post.id}")

@app.route("/posts/<int:post_id>/delete", methods=["POST"])
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return redirect(f"/users/{post.user_id}")


################### TAG ROUTES ####################

@app.route("/tags")
def view_tags():
    """ Lists all tags, with links to the tag detail page. """
    tags = Tag.query.all()
    return render_template("tags.html", tags=tags)

@app.route("/tags/<int:tag_id>")
def view_tag_details(tag_id):
    """ Show detail about a tag. Have links to edit form and to delete. """
    tag = Tag.query.get_or_404(tag_id)
    posts = tag.posts_tags
    return render_template("tag_info.html", tag=tag, posts=posts)

@app.route("/tags/new")
def add_tag_form():
    """ Shows a form to add a new tag """
    return render_template("add_tag.html",)

@app.route("/tags/new", methods=["POST"])
def add_tag():
    """ Process add form, adds tag, and redirect to tag list. """
    tag_name = request.form['tag_name']

    tag = Tag(name=tag_name)
    db.session.add(tag)
    db.session.commit()

    return redirect(f"/tags")

@app.route("/tags/<int:tag_id>/edit")
def edit_tag_form(tag_id):
    """ Show edit form for a tag. """
    
    tag = Tag.query.get_or_404(tag_id)
    return render_template("tag_edit_info.html", tag=tag)

@app.route("/tags/<int:tag_id>/edit", methods=["POST"])
def edit_tag(tag_id):
    """ Process edit form, edit tag, and redirects to the tags list. """

    tag = Tag.query.get_or_404(tag_id)
    tag.name = request.form['tag_name']

    db.session.add(tag)
    db.session.commit()
    return redirect(f"/tags/{tag.id}")

@app.route("/tags/<int:tag_id>/delete", methods=["POST"])
def delete_tag(tag_id):
    """ Delete a tag. """
    tag = Tag.query.get_or_404(tag_id)
    db.session.delete(tag)
    db.session.commit()
    return redirect("/tags")
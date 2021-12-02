"""Models for Blogly."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)

class User(db.Model):
    """User."""

    __tablename__ = "users"

    posts = db.relationship('Post', backref='users', cascade="all, delete-orphan")

    id = db.Column(db.Integer,
                   primary_key=True,
                   autoincrement=True)
    first_name = db.Column(db.String(50),
                     nullable=False)
    last_name = db.Column(db.String(50),
                    nullable=False)
    image_url = db.Column(db.String,
                    nullable=True,
                    default="../static/user.png")
    
    def get_full_name(self):
        """Create full name."""
        
        return f"{self.first_name} {self.last_name}"


class Post(db.Model):
    """ Posts """

    __tablename__ = 'posts'

    id = db.Column(db.Integer,
                   primary_key=True,
                   autoincrement=True)
    title = db.Column(db.String(50),
                     nullable=False)
    content = db.Column(db.Text,
                    nullable=False)
    created_at = db.Column(db.String,
                    nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    posts_tags = db.relationship('PostTag', backref='post', cascade="all, delete-orphan")


class Tag(db.Model):
    """ Post tags """
    __tablename__ = 'tags'

    id = db.Column(db.Integer,
                primary_key=True,
                autoincrement=True)
    name = db.Column(db.String(12),
                    nullable=False,
                    unique=True)
    
    posts_tags = db.relationship('PostTag', backref='tags', cascade="all, delete-orphan")


class PostTag(db.Model):
    """ Posts and tags """

    __tablename__ = 'posts_tags'
    
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey("tags.id"), primary_key=True)
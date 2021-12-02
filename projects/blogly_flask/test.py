from unittest import TestCase
from app import app
from models import db, User, Post

# Use test database and don't clutter tests with SQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly_test'
app.config['SQLALCHEMY_ECHO'] = False

# Make Flask errors be real errors, rather than HTML pages with error info
app.config['TESTING'] = True

# This is a bit of hack, but don't use Flask DebugToolbar
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

db.drop_all()
db.create_all()

class UserViewsTestCase(TestCase):
    """Tests for views for Users."""

    def setUp(self):
        """Add sample user."""
        
        Post.query.delete()
        User.query.delete()
        user = User(first_name="First", last_name="Last")
        db.session.add(user)
        db.session.commit()

        self.user_id = user.id

    def tearDown(self):
        """Clean up any fouled transaction."""
        db.session.rollback()

    def test_list_users(self):
        with app.test_client() as client:
            resp = client.get("/", follow_redirects=True)
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('First Last', html)

    def test_show_user_info(self):
        with app.test_client() as client:
            resp = client.get(f"/users/{self.user_id}")
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('<h5>First Last</h5>', html)

    def test_add_user(self):
        with app.test_client() as client:
            d = {"first_name":"Emma", "last_name":"Pines-Schwartz", "image_url":"https:/media-exp1.licdn.com/dms/image/C5603AQFg_fd_3-YqYQ/profile-displayphoto-shrink_400_400/0/1625856943206?e=1637798400&v=beta&t=0EaRsJOcKF7sKVUYYpmqHX9Nqbh8LKQE7qMdHINsTRs"}
            resp = client.post("/users/new", data=d, follow_redirects=True)
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('Emma Pines-Schwartz</a></p>', html)
            self.assertIn('First Last</a></p>', html)




class PostViewsTestCase(TestCase):
    """Tests for views for Posts."""

    def setUp(self):
        """Add sample user and post."""


        Post.query.delete()
        User.query.delete()
        user = User(first_name="First", last_name="Last")
        db.session.add(user)
        db.session.commit()

        self.user_id = user.id

        post = Post(title="New Post", content="This is a test post", user_id=self.user_id, created_at="December 31, 1999")
        db.session.add(post)
        db.session.commit()
        self.post_id = post.id


    def tearDown(self):
        """Clean up any fouled transaction."""
        db.session.rollback()

    def test_list_posts(self):
        with app.test_client() as client:
            resp = client.get("/posts", follow_redirects=True)
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('New Post</a> <small style="font-size:12px">by First Last', html)

    def test_show_post(self):
        with app.test_client() as client:
            resp = client.get(f"/posts/{self.post_id}")
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('>by First Last</a></p>', html)

    def test_add_post(self):
        with app.test_client() as client:
            d = {"title":"Post Post", "content":"This post is a post!"}
            resp = client.post(f"/users/{self.user_id}/posts/new", data=d, follow_redirects=True)
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('<a href="/posts/2">Post Post</a>', html)

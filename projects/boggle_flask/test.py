from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_board(self):
        with self.client:
            resp = self.client.get('/')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIn('<b>Highscore:</b>', html)
            self.assertIsNone(session.get('nplays'))
            self.assertIn('<b>Times Played:</b>', html)

    def test_word_validation(self):
        with self.client:
            with self.client.session_transaction() as session:
                session["board"] = [['D', 'O', 'G', 'D', 'O'],
                                    ['D', 'O', 'G', 'D', 'O'],
                                    ['D', 'O', 'G', 'D', 'O'],
                                    ['D', 'O', 'G', 'D', 'O'],
                                    ['D', 'O', 'G', 'D', 'O']]
        resp = self.client.get('/check-word?guess=dog')
        self.assertEqual(resp.json['result'], 'ok')

        resp = self.client.get('/check-word?guess=god')
        self.assertEqual(resp.json['result'], 'ok')

    def test_word_not_on_board(self):
        self.client.get('/')
        resp = self.client.get('/check-word?guess=abalienation')
        self.assertEqual(resp.json['result'], 'not-on-board')

        resp = self.client.get('/check-word?guess=impossible')
        self.assertEqual(resp.json['result'], 'not-on-board')

    def test_not_a_word(self):
        self.client.get('/')
        resp = self.client.get('/check-word?guess=jfjsksld')
        self.assertEqual(resp.json['result'], 'not-a-word')

        resp = self.client.get('/check-word?guess=df@!soe3')
        self.assertEqual(resp.json['result'], 'not-a-word')
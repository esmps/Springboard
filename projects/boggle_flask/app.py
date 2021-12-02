from boggle import Boggle
from flask import Flask, request, render_template, session, redirect, jsonify

app = Flask(__name__)
app.config['SECRET_KEY'] = "oh-so-secret"

boggle_game = Boggle()

@app.route('/')
def display_board():
    session["board"] = boggle_game.make_board()
    board = session["board"]
    highscore = session.get('highscore', 0)
    nplays = session.get('nplays', 0)
    return render_template("board.html", board=board, highscore=highscore, nplays=nplays)

@app.route('/check-word')
def check_word():
    word = request.args["guess"]
    board = session["board"]
    res = boggle_game.check_valid_word(board, word)
    return jsonify({'result': res})

@app.route('/end-game', methods=["POST"])
def end_game():
    score = request.json["score"]
    highscore = session.get('highscore', 0)
    nplays = session.get('nplays', 0)

    session["nplays"] = nplays + 1
    session["highscore"] = max(score, highscore)

    return jsonify(brokeRecord = score > highscore)
from flask import Flask, render_template, request, redirect, flash, session
from surveys import satisfaction_survey

app = Flask(__name__)
app.config['SECRET_KEY'] = "never-tell!"


@app.route('/')
def home_page():
    title = satisfaction_survey.title
    instructions = satisfaction_survey.instructions
    return render_template("home.html", title=title, instructions=instructions)

@app.route('/start-survey', methods=['POST'])
def start_survey():
    session['responses'] = []
    return redirect("/questions/0")

@app.route('/questions/<int:num>')
def questions(num):
    responses = session.get("responses")
    print(responses)
    if len(responses) >= len(satisfaction_survey.questions):
        return redirect('/complete')
    if responses is None:
        return render_template('/')
    if (len(responses) != num):
        flash("Incorrect question ID.")
        return redirect(f"/questions/{len(responses)}")
    question = satisfaction_survey.questions[num].question
    choices = satisfaction_survey.questions[num].choices
    return render_template("questions.html", question_num=num, question=question, choices=choices)

@app.route('/answer', methods=["POST"])
def answer():
    responses = session["responses"]
    if len(responses) == len(satisfaction_survey.questions):
        return redirect('/complete')
    else:
        answer = request.form['answer']
        responses.append(answer)
        session["responses"] = responses
        return redirect(f"/questions/{len(responses)}")

@app.route('/complete')
def complete():
    return render_template("complete.html")
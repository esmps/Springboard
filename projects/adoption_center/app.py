"""Adoption Center application."""

from flask import Flask, request, redirect, render_template, flash
from models import db, connect_db, Pet
from forms import AddPetForm, EditPetForm

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///adoption_center'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
db.create_all()

# from flask_debugtoolbar import DebugToolbarExtension
app.config['SECRET_KEY'] = "SECRET!"
# debug = DebugToolbarExtension(app)


@app.route("/")
def home_page():
    """List pets and show add button."""

    pets = Pet.query.all()
    return render_template("home.html", pets=pets)

@app.route("/add", methods=["GET", "POST"])
def add_pet():
    """Add a new pet."""

    form = AddPetForm()
    if form.validate_on_submit():
        name = form.name.data
        species = form.species.data
        age = form.age.data
        notes = form.notes.data
        if form.photo_url.data:
            photo_url = form.photo_url.data
            pet = Pet(name=name, species=species, photo_url=photo_url, age=age, notes=notes)
        else:
            pet = Pet(name=name, species=species, age=age, notes=notes)
        db.session.add(pet)
        db.session.commit()

        return redirect("/")
    else:
        return render_template("add_pet_form.html", form=form)

@app.route("/<int:pet_id>", methods=["GET", "POST"])
def pet_info(pet_id):
    """Get pet info"""

    pet = Pet.query.get_or_404(pet_id)
    form = EditPetForm(obj=pet)

    if form.validate_on_submit():
        if form.photo_url.data:
            pet.photo_url = form.photo_url.data
        else:
            pet.photo_url = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        pet.notes = form.notes.data
        pet.available = form.available.data
        db.session.commit()
        flash(f"Pet {pet.name} updated!")
        return redirect(f"/{pet.id}")

    else:
        return render_template("pet_info.html", form=form, pet=pet)
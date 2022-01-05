"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();


/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: login, admin
 **/

router.post("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});


/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: login, admin
 **/

router.get("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin }
 *
 * Authorization required: admin or users own profile
 **/

router.get("/:username", ensureLoggedIn, async function (req, res, next) {
  try {
    if (res.locals.user.isAdmin === true || req.params.username === res.locals.user.username){
      const user = await User.get(req.params.username);
      return res.json({ user });
    }else{
      throw new UnauthorizedError(`You must be @${req.params.username} or an admin to see this.`);
    }
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or users own profile
 **/

router.patch("/:username", ensureLoggedIn, async function (req, res, next) {
  try {
    if (res.locals.user.isAdmin === true || req.params.username === res.locals.user.username){
      const validator = jsonschema.validate(req.body, userUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
      const user = await User.update(req.params.username, req.body);
      return res.json({ user });
    }else{
      throw new UnauthorizedError(`You must be @${req.params.username} or an admin to see this.`);
    }
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or users own profile
 **/

router.delete("/:username", ensureLoggedIn, async function (req, res, next) {
  try {
      if (res.locals.user.isAdmin === true || req.params.username === res.locals.user.username){
        await User.remove(req.params.username);
        return res.json({ deleted: req.params.username });
      }else{
        throw new UnauthorizedError(`You must be @${req.params.username} or an admin to see this.`);
      }
  } catch (err) {
    return next(err);
  }
});

router.post("/:username/jobs/:id", ensureLoggedIn, async function (req, res, next) {
  try{
    if (res.locals.user.isAdmin === true || req.params.username === res.locals.user.username){
      await User.apply({ username: req.params.username, jobID: req.params.id });
      return res.json({ applied: req.params.id })
    }
  }catch(err){
    return next(err);
  }
})


module.exports = router;

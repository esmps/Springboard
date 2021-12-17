const db = require("../db");
const ExpressError = require("../expressError");
var slugify = require('slugify');
const express = require("express");
const router = new express.Router();
const { json } = require("express/lib/response");


// Return list of industries
router.get("/", async (req, res, next) => {
    try{
        const results = await db.query(`SELECT * FROM industries`)
        return res.json({companies: results.rows })
    }catch(e){
        return next(e);
    }
});

router.post("/", async (req, res, next) => {
    try{
        const { industry } = req.body;
        if (!industry) throw new ExpressError("Missing data", 400);
        let code = slugify(industry, {lower: true});
        const results = await db.query(`INSERT INTO industries VALUES ($1, $2) RETURNING code, industry`, [code, industry]);
        if (results.rows.length === 0) throw new ExpressError(`Could not create new industry.`, 400)
        return res.status(201).json({company: results.rows[0]});
    }catch(e){
        if (e.message.includes("duplicate key value")) e = new ExpressError("Duplicate company", 400);
        return next(e);
    }
});

router.post("/:comp_code/:ind_code", async (req, res, next) => {
    try{
        const { comp_code, ind_code } = req.params;
        const results = await db.query(`INSERT INTO comp_ind VALUES ($1, $2) RETURNING comp_code, ind_code`, [comp_code, ind_code]);
        return res.json(results.rows[0]);
    }catch(e){
        return next(e);
    }
});

module.exports = router;
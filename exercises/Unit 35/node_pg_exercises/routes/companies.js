const db = require("../db");
const express = require("express");
const router = new express.Router();

const ExpressError = require("../expressError");
const { json } = require("express/lib/response");

// Return list of companies
router.get("/", async (req, res, next) => {
    try{
        const results = await db.query(`SELECT * FROM companies`)
        return res.json({companies: results.rows })
    }catch(e){
        return next(e);
    }
});

// Return obj of a company
router.get("/:code", async (req, res, next) => {
    try{
        const results = await db.query(`SELECT code, name, description FROM companies WHERE code=$1`, [req.params.code])
        if (results.rows.length === 0) throw new ExpressError(`${req.params.code} cannot be found`, 404);
        return res.json({company: results.rows[0]});
    }catch(e){
        return next(e);
    }
});

// Adds a company
router.post("/", async (req, res, next) => {
    try{
        const {code, name, description } = req.body;
        const results = await db.query(
            `INSERT INTO companies (code, name, description)
             VALUES ($1, $2, $3)
             RETURNING code, name, description`, [code, name, description]);
        return res.status(201).json({company: results.rows[0]});
    }catch(e){
        return next(e);
    }
});

// Edits existing company
router.patch("/:code", async (req, res, next) => {
    try{
        const { name, description } = req.body;
        const results = await db.query(
            `UPDATE companies SET name=$1, description=$2
             WHERE code=$3
             RETURNING code, name, description`, [name, description, req.params.code]);
        if (results.rowCount === 0) throw new ExpressError(`${req.params.code} cannot be found`, 404);
        return res.json({company: results.rows[0]})
    }catch(e){
        return next(e);
    }
});

// Deletes existing company
router.delete("/:code", async (req, res, next) => {
    try{
        const results = await db.query(
            `DELETE FROM companies WHERE code=$1`,
            [req.params.code]
        )
        if (results.rowCount === 0) throw new ExpressError(`${req.params.code} cannot be found`, 404);
        return res.json({status: "deleted"})
    }catch(e){
        return next(e);
    }
});

module.exports = router;
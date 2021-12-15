const db = require("../db");
const ExpressError = require("../expressError");
var slugify = require('slugify');
const express = require("express");
const router = new express.Router();
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
        if (results.rows.length === 0) throw new ExpressError(`Company code ${req.params.code} cannot be found`, 404);
        const invoice_res = await db.query(`SELECT id FROM invoices WHERE comp_code=$1`, [req.params.code]);
        const company = results.rows[0];
        if (invoice_res.rows.length > 0){
            company.invoices = invoice_res.rows.map(inv => inv.id);
        }
        else{
            company.invoices = "No invoices yet."
        }
        return res.json({company: company});
    }catch(e){
        return next(e);
    }
});

// Adds a company
router.post("/", async (req, res, next) => {
    try{
        const {name, description } = req.body;
        if (!name || !description) throw new ExpressError("Missing data", 400);
        let code = slugify(name, {lower: true});
        const results = await db.query(
            `INSERT INTO companies (code, name, description)
             VALUES ($1, $2, $3)
             RETURNING code, name, description`, [code, name, description]);
        if (results.rows.length === 0) throw new ExpressError(`Could not create new company.`, 400)
        return res.status(201).json({company: results.rows[0]});
    }catch(e){
        if (e.message.includes("duplicate key value")) e = new ExpressError("Duplicate company", 400);
        return next(e);
    }
});

// Edits existing company
router.patch("/:code", async (req, res, next) => {
    try{
        const { name, description } = req.body;
        if (!name && !description) throw new ExpressError("Cannot change company code. Please input a new name or description", 400);
        let results;
        if (!name){
            results = await db.query(
                `UPDATE companies SET description=$1
                 WHERE code=$2
                 RETURNING code, name, description`, [description, req.params.code]);
        }
        else if(!description){
            results = await db.query(
                `UPDATE companies SET name=$1
                 WHERE code=$2
                 RETURNING code, name, description`, [name, req.params.code]);
        }
        else{
            results = await db.query(
                `UPDATE companies SET name=$1, description=$2
                 WHERE code=$3
                 RETURNING code, name, description`, [name, description, req.params.code]);
        }
        if (results.rowCount === 0) throw new ExpressError(`Company code ${req.params.code} cannot be found`, 404);
        return res.json({company: results.rows[0]})
    }catch(e){
        return next(e);
    }
});

// Deletes existing company
router.delete("/:code", async (req, res, next) => {
    try{
        const results = await db.query(`DELETE FROM companies WHERE code=$1`, [req.params.code])
        if (results.rowCount === 0) throw new ExpressError(`Company code ${req.params.code} cannot be found`, 404);
        return res.json({status: "deleted"})
    }catch(e){
        return next(e);
    }
});

module.exports = router;
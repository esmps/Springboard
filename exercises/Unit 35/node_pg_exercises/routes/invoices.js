const db = require("../db");
const express = require("express");
const router = new express.Router();

const ExpressError = require("../expressError");
const { json } = require("express/lib/response");

// Return list of invoices
router.get("/", async (req, res, next) => {
    try{
        const results = await db.query(`SELECT * FROM invoices`)
        return res.json({invoices: results.rows })
    }catch(e){
        return next(e);
    }
});

// Return an invoice
router.get("/:id", async (req, res, next) => {
    try{
        const results = await db.query(`SELECT id, amt, paid, add_date, paid_date, comp_code FROM invoices WHERE id=$1`, [req.params.id])
        if (results.rows.length === 0) throw new ExpressError(`Invoice ${req.params.id} cannot be found`, 404);
        const data = results.rows[0];
        const comp_res = await db.query(`SELECT code, name, description FROM companies WHERE code=$1`, [data.comp_code]);
        const invoice = {
            id: data.id,
            amt: data.amt,
            paid: data.paid,
            add_date: data.add_date,
            paid_date: data.paid_date,
            company: {
                code: comp_res.rows[0].code,
                name: comp_res.rows[0].name,
                description: comp_res.rows[0].description
            }
        };
        return res.json({invoice: invoice});
    }catch(e){
        return next(e);
    }
});

// Adds an invoice
router.post("/", async (req, res, next) => {
    try{
        let { comp_code, amt } = req.body;
        const results = await db.query(
            `INSERT INTO invoices (comp_code, amt)
             VALUES ($1, $2)
             RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt]);
        const data = results.rows[0]
        return res.status(201).json({ invoice: data });
    }catch(e){
        return next(e);
    }
});

// Edits existing invoice
router.patch("/:id", async (req, res, next) => {
    try{
        const { amt } = req.body;
        const results = await db.query(
            `UPDATE invoices SET amt=$1
             WHERE id=$2
             RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, req.params.id]);
        if (results.rowCount === 0) throw new ExpressError(`Invoice ${req.params.id} cannot be found`, 404);
        return res.json({invoice: results.rows[0]})
    }catch(e){
        return next(e);
    }
});

// Deletes existing invoice
router.delete("/:id", async (req, res, next) => {
    try{
        const results = await db.query(`DELETE FROM invoices WHERE id=$1`,[req.params.id])
        if (results.rowCount === 0) throw new ExpressError(`Invoice ${req.params.id} cannot be found`, 404);
        return res.json({status: "deleted"})
    }catch(e){
        return next(e);
    }
});

module.exports = router;

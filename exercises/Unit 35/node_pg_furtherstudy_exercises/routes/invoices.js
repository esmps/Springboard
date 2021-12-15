const db = require("../db");
const ExpressError = require("../expressError");
const express = require("express");
const router = new express.Router();
const { json } = require("express/lib/response");

// Return list of invoices
router.get("/", async (req, res, next) => {
    try{
        const results = await db.query(`SELECT id, comp_Code, amt, paid, add_date, paid_date FROM invoices`)
        return res.send({invoices: results.rows })
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
        if (!comp_code || !amt) throw new ExpressError("Must provide a company code AND amount.", 400);
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
        const invoice = await db.query(`SELECT id, paid, amt FROM invoices WHERE id=$1`, [req.params.id]);
        if (invoice.rowCount === 0) throw new ExpressError(`Invoice ${req.params.id} cannot be found`, 404);
        const { amt = invoice.rows[0].amt, paid = invoice.rows[0].paid } = req.body;
        let results;
        if (invoice.rows[0].paid === false && paid === true){
            results = await db.query(
                `UPDATE invoices SET amt=$1, paid=$2, paid_date=$3
                 WHERE id=$4
                 RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, paid, new Date, req.params.id]);
        }
        else if (invoice.rows[0].paid === true && paid === false){
            results = await db.query(
                `UPDATE invoices SET amt=$1, paid=$2, paid_date=null
                 WHERE id=$3
                 RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, paid, req.params.id]);
        }
        else{
            results = await db.query(
                `UPDATE invoices SET amt=$1
                 WHERE id=$2
                 RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, req.params.id]);
        }
        return res.json({invoice: results.rows[0]})
    }catch(e){
        console.log(e);
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

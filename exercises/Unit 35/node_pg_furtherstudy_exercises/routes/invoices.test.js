process.env.NODE_ENV = "test";
const request = require("supertest");
var slugify = require('slugify');
const app = require("../app");
const db = require("../db");

let newCompany, newInvoice;
const name = "Amazon";
const code = slugify(name, {lower: true});

beforeEach(async function () {
    const cRes = await db.query(
        `INSERT INTO companies
        VALUES ($1, $2, 'Everything from A to Z')
        RETURNING code, name, description`, [code, name]);
    newCompany = cRes.rows[0];

    const iRes = await db.query(
        `INSERT INTO invoices (comp_Code, amt, paid, paid_date)
        VALUES ($1, 100, false, null)
        RETURNING id, comp_Code, amt, paid, add_date, paid_date`, [code]); 
    newInvoice = iRes.rows[0];
});

afterEach(async function () {
    await db.query(`DELETE FROM companies`);
    await db.query(`DELETE FROM invoices`);
});

// close db connection
afterAll(async function() {
    await db.end();
  });

describe("GET /invoices", () => {
    test("Get list of invoices", async () => {
        const res = await request(app).get('/invoices');
        expect(res.statusCode).toBe(200);
        res.body.invoices[0].add_date = new Date(res.body.invoices[0].add_date);
        expect(res.body.invoices[0]).toEqual(newInvoice);
        expect(res.body.invoices).toHaveLength(1);
    });
});

describe("GET /invoices/:id", () => {
    test("Get invoice by id", async () => {
        const res = await request(app).get(`/invoices/${newInvoice.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.invoice).toHaveProperty('company');
        expect(res.body.invoice.id).toEqual(newInvoice.id);
        expect(res.body.invoice.company.name).toEqual('Amazon')
    });
    test("Respond with 404 if cannot find invoice", async () => {
        const res = await request(app).get(`/invoices/0`);
        expect(res.statusCode).toBe(404);
    });
});

describe("POST /invoices", () => {
    test("Create a new invoice", async () => {
        const invoice = {
            comp_code: newCompany.code,
            amt: 300
        }
        const res = await request(app).post('/invoices').send(invoice);
        expect(res.statusCode).toBe(201);
        expect(res.body.invoice.comp_code).toEqual(newCompany.code);
        expect(res.body.invoice.amt).toEqual(300);
    });
    test("Respond with 400 due to missing amt", async () => {
        const res = await request(app).post('/invoices').send({
            comp_code: newCompany.code
        });
        expect(res.statusCode).toBe(400);
    });
    test("Respond with 404 due to missing comp_code", async () => {
        const res = await request(app).post('/invoices').send({
            amt: 500
        });
        expect(res.statusCode).toBe(400);
    });
}); 

describe("PATCH /invoices/:id", () => {
    test("Update invoice amount", async () => {
        const res = await request(app).patch(`/invoices/${newInvoice.id}`).send({ amt: 1234, paid: true});
        expect(res.statusCode).toBe(200);
        console.log(res.body)
        expect(res.body.invoice.amt).toEqual(1234);
        expect(res.body.invoice.paid).toEqual(true);
    });
    test("Respond with 404 if cannot find invoice", async () => {
        const res = await request(app).patch(`/invoices/0`).send({ amt: 1111, paid: false });
        expect(res.statusCode).toBe(404);
    });
});

describe("DELETE /invoices/:id", () => {
    test("Deletes a single invoice", async () => {
      const res = await request(app).delete(`/invoices/${newInvoice.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({status: "deleted"});
    });
    test("Respond with 404 if cannot find company", async () => {
        const res = await request(app).delete(`/invoices/0`);
        expect(res.statusCode).toBe(404);
    });
  });
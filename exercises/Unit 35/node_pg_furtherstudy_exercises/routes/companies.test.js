process.env.NODE_ENV = "test";
const slugify = require("slugify");
const request = require("supertest");
const app = require("../app");
const db = require("../db");

let newCompany;
const name = "Amazon";
const code = slugify(name, {lower: true});

beforeEach(async function () {
    const res = await db.query(
        `INSERT INTO companies
        VALUES ($1, $2, 'Everything from A to Z')
        RETURNING code, name, description`, [code, name]);
    newCompany = res.rows[0];
});

afterEach(async function () {
    await db.query(`DELETE FROM companies`);
});

// close db connection
afterAll(async function() {
    await db.end();
  });

describe("GET /companies", () => {
    test("Get list of companies", async () => {
        const res = await request(app).get('/companies');
        expect(res.statusCode).toBe(200);
        expect(res.body.companies[0]).toEqual( newCompany );
        expect(res.body.companies).toHaveLength(1);
    });
});

describe("GET /companies/:code", () => {
    test("Get company by code", async () => {
        const res = await request(app).get(`/companies/${newCompany.code}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.company).toHaveProperty('invoices');
        expect(res.body.company.invoices).toEqual('No invoices yet.');
        expect(res.body.company.name).toEqual('Amazon');
        expect(res.body.company.code).toEqual(newCompany.code);
    });
    test("Respond with 404 if cannot find company", async () => {
        const res = await request(app).get(`/companies/fakeCode`);
        expect(res.statusCode).toBe(404);
    });
});

describe("POST /companies", () => {
    test("Create a new company", async () => {
        const apple = {
            code: slugify("Apple Computer", {lower: true}),
            name: "Apple Computer",
            description: "Maker of OSX."
        }
        const res = await request(app).post('/companies').send(apple);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({company: apple});
        expect(res.body.company.name).toEqual("Apple Computer");
        expect(res.body.company.description).toEqual("Maker of OSX.");
    });
    test("Respond with 400 due to missing info", async () => {
        const res = await request(app).post('/companies').send({
            description: "This shouldn't work"
        });
        expect(res.statusCode).toBe(400);
    });
    test("Respond with 400 due to duplicate company", async () => {
        const res = await request(app).post('/companies').send({
            code: "amzn",
            name: "Amazon",
            description: "I hope this doesn't work!"
        });
        expect(res.statusCode).toBe(400);
    });
}); 


describe("PATCH /companies/:code", () => {
    test("Update company name", async () => {
        const res = await request(app).patch(`/companies/${newCompany.code}`).send({
            name: "Amazon Inc."
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"company": {"code": newCompany.code, "name": "Amazon Inc.", "description": "Everything from A to Z"} });
    });
    test("Update company description", async () => {
        const res = await request(app).patch(`/companies/${newCompany.code}`).send({
            description: "From A to Z."
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"company": {"code": newCompany.code, "name": "Amazon", "description": "From A to Z."} });
    });
    test("Respond with 400 if no data sent", async () => {
        const res = await request(app).patch(`/companies/fakeCode`);
        expect(res.statusCode).toBe(400);
    });
    test("Respond with 404 if cannot find company", async () => {
            const res = await request(app).patch(`/companies/fakeCode`).send({
            name: "Fake fake",
            description: "Shouldn't work!"
        });
        expect(res.statusCode).toBe(404);
    });
});

describe("DELETE /companies/:code", () => {
    test("Deletes a single company", async () => {
      const res = await request(app).delete(`/companies/${newCompany.code}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({status: "deleted"});
    });
    test("Respond with 404 if cannot find company", async () => {
        const res = await request(app).delete(`/companies/fakeCode`);
        expect(res.statusCode).toBe(404);
    });
  });
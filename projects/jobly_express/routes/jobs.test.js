"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token
} = require("./_testCommon");
const req = require("express/lib/request");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
  const newJob = {
    title: "New Job",
    salary: 123000,
    equity: 0,
    companyHandle: "c1"
  };

  test("ok for admin", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        title: "New Job",
        salary: 123000,
        equity: '0',
        companyHandle: "c1"
      }
    });
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
          title: "new job",
          equity: .005,
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
            title: "New Job",
            salary: "123000",
            equity: 0,
            companyHandle: "c1"
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
  test("bad request by unauthorized user", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************jobs */

describe("GET /jobs", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs:
          [
            {
                title: "j1",
                salary: 100000,
                equity:'0',
                companyHandle: "c1"
              },
              {
                title: "j2",
                salary: 200000,
                equity: '0.09',
                companyHandle: "c2"
              },
              {
                title: "j3",
                salary: 300000,
                equity: '0.12',
                companyHandle: "c3"
              }
          ]
    });
  });
  test("filter results with all filters used", async function(){
    const resp = await request(app).get("/jobs/?minSalary=150000&title=J&hasEquity=true");
    expect(resp.body).toEqual({
      jobs:
        [
            {
                title: "j2",
                salary: 200000,
                equity: '0.09',
                companyHandle: "c2"
              },
              {
                title: "j3",
                salary: 300000,
                equity: '0.12',
                companyHandle: "c3"
              }
        ]
    })
  });
  test("filter results with only title filter used", async function(){
    const resp = await request(app).get("/jobs/?title=1")
    expect(resp.body).toEqual({
      jobs:
        [
            {
                title: "j1",
                salary: 100000,
                equity:'0',
                companyHandle: "c1"
              }
        ]
    });
  });
  test("filter results with only minSalary filter used", async function(){
    const resp = await request(app).get("/jobs/?minSalary=225000")
    expect(resp.body).toEqual({
      jobs:
        [
            {
                title: "j3",
                salary: 300000,
                equity: '0.12',
                companyHandle: "c3"
            }
        ]
    });
  });
  test("filter results with only hasEquity filter used", async function(){
    const resp = await request(app).get("/jobs/?hasEquity=true")
    expect(resp.body).toEqual({
      jobs:
        [
            {
                title: "j2",
                salary: 200000,
                equity: '0.09',
                companyHandle: "c2"
              },
              {
                title: "j3",
                salary: 300000,
                equity: '0.12',
                companyHandle: "c3"
              }
        ]
    });
  });
  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE jobs CASCADE");
    const resp = await request(app)
        .get("/jobs")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /jobs/:handle */

describe("GET /jobs/:id", function () {
  test("works for anon", async function () {
    const job = await db.query(`SELECT id
    FROM jobs
    WHERE title='j1'`);
    const resp = await request(app).get(`/jobs/${job.rows[0].id}`);
    expect(resp.body).toEqual({
      job: {
        title: "j1",
        salary: 100000,
        equity: '0',
        companyHandle: "c1"
      },
    });
  });

  test("not found for no such jobs", async function () {
    const resp = await request(app).get(`/jobs/0`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /jobs/:handle */

describe("PATCH /jobs/:id", function () {
  test("works for admins", async function () {
    const job = await db.query(`SELECT id FROM jobs WHERE title='j1'`);
    const resp = await request(app)
        .patch(`/jobs/${job.rows[0].id}`)
        .send({
            title: "j1-new",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({
      job: {
        title: "j1-new",
        salary: 100000,
        equity: '0',
        companyHandle: "c1"
      },
    });
  });

  test("unauth for anon", async function () {
    const job = await db.query(`SELECT id FROM jobs WHERE title='j1'`);
    const resp = await request(app)
        .patch(`/jobs/${job.rows[0].id}`)
        .send({
          title: "j1-new",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("invalid job id", async function () {
    const resp = await request(app)
        .patch(`/jobs/0`)
        .send({
          title: "new nope",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on companyHandle change attempt", async function () {
    const job = await db.query(`SELECT id FROM jobs WHERE title='j1'`);
    const resp = await request(app)
        .patch(`/jobs/${job.rows[0].id}`)
        .send({
          companyHandle: "c3",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async function () {
    const job = await db.query(`SELECT id FROM jobs WHERE title='j1'`);
    const resp = await request(app)
        .patch(`/jobs/${job.rows[0].id}`)
        .send({
          equity: "0.05",
        })
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", function () {
  test("works for admins", async function () {
    const job = await db.query(`SELECT id FROM jobs WHERE title='j1'`);
    const resp = await request(app)
        .delete(`/jobs/${job.rows[0].id}`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({ deleted: `${job.rows[0].id}` });
  });

  test("unauth for anon", async function () {
    const job = await db.query(`SELECT id FROM jobs WHERE title='j1'`);
    const resp = await request(app)
        .delete(`/jobs/${job.rows[0].id}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such company", async function () {
    const resp = await request(app)
        .delete(`/jobs/0`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

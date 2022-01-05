"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "New Job",
    salary: 123000,
    equity: 0,
    companyHandle: "c1"
  };

  test("works", async function () {
    let job = await Job.create(newJob);

    expect(job).toEqual(        {
        title: "New Job",
        salary: 123000,
        equity: '0',
        companyHandle: "c1"
    });

    const result = await db.query(
          `SELECT title, salary, equity, company_handle
           FROM jobs
           WHERE title = 'New Job'`);
    expect(result.rows).toEqual([
        {
            title: "New Job",
            salary: 123000,
            equity: '0',
            company_handle: "c1"
        }
    ]);
  });

  test("bad request with duplicate", async function () {
    try {
      await Job.create(newJob);
      await Job.create(newJob);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
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
    ]);
  });
  test("works: minSalary filter", async function () {
    const filters = { minSalary: 150000 }
    let jobs = await Job.findAll(filters);
    expect(jobs).toEqual([
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
    ]);
  });
  test("works: title filter", async function () {
    const filters = { title: "J" }
    let jobs = await Job.findAll(filters);
    expect(jobs).toEqual([
    {
        title: "j1",
        salary: 100000,
        equity: '0',
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
    ]);
  });
  test("works: hasEquity filter", async function () {
    const filters = { hasEquity: true }
    let jobs = await Job.findAll(filters);
    expect(jobs).toEqual([
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
    ]);
  });
  test("works: all filters", async function () {
    const filters = {
      title: "j",
      minSalary: 225000,
      hasEquity: true
    }
    let jobs = await Job.findAll(filters);
    expect(jobs).toEqual([
    {
        title: "j3",
        salary: 300000,
        equity: '0.12',
        companyHandle: "c3"
    }
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works: id = 1", async function () {
    let job = await Job.get(1);
    expect(job).toEqual({
        title: "j1",
        salary: 100000,
        equity: '0',
        companyHandle: "c1"
    },);
  });
  test("works: id = 3", async function () {
    let job = await Job.get(3);
    expect(job).toEqual({
        title: "j3",
        salary: 300000,
        equity: '0.12',
        companyHandle: "c3"
    },);
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "j3-1",
    salary: 310000,
    equity: 0.13,
    company_handle: "c3"
  };

  test("works", async function () {
    let job = await Job.update(3, updateData);
    expect(job).toEqual({
      title: "j3-1",
      salary: 310000,
      equity: '0.13',
      companyHandle: "c3"
    });

    const result = await db.query(
          `SELECT title, salary, equity, company_handle AS "companyHandle"
           FROM jobs
           WHERE id = '3'`);
    expect(result.rows).toEqual([{
      title: "j3-1",
      salary: 310000,
      equity: '0.13',
      companyHandle: "c3"
    }]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      title: "j1",
      salary: null,
      equity: null,
      company_handle: "c1"
    };

    let job = await Job.update(1, updateDataSetNulls);
    expect(job).toEqual({
      title: "j1",
      salary: null,
      equity: null,
      companyHandle: "c1"
    });

    const result = await db.query(
          `SELECT title, salary, equity, company_handle AS "companyHandle"
           FROM jobs
           WHERE id = '1'`);
    expect(result.rows).toEqual([{
      title: "j1",
      salary: null,
      equity: null,
      companyHandle: "c1"
    }]);
  });

  test("not found if no such company", async function () {
    try {
      await Job.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(2, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(3);
    const res = await db.query(
        "SELECT id FROM jobs WHERE id = '3'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such company", async function () {
    try {
      await Job.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
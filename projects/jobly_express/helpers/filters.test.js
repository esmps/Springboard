const { sqlForFilters } = require("./filters");

describe("create SQL syntax for company filters", function () {

    const filtersMinMax = {
        minEmployees: 10,
        maxEmployees: 100
    };

    const filtersNameLike = {
        nameLike: "net"
    }
    const filtersAllCompanies = {
        nameLike: "cos",
        minEmployees: 11,
        maxEmployees: 110
    }
    const filtersAllJobs = {
        title: "fli",
        minSalary: 68000,
        hasEquity: 'false'
    }

    test("filtersMinMax", function () {
        const res = sqlForFilters(filtersMinMax)
        expect(res).toEqual("num_employees >= 10 AND num_employees <= 100");
    });
    test("filtersMin", function () {
        const res = sqlForFilters({ minEmployees: 5 })
        expect(res).toEqual("num_employees >= 5");
    });
    test("filtersMax", function () {
        const res = sqlForFilters({ maxEmployees: 342 })
        expect(res).toEqual("num_employees <= 342");
    });
    test("filtersNameLike", function () {
        const res = sqlForFilters({ nameLike: "net" })
        expect(res).toEqual("name ILIKE '%net%'");
    });
    test("filtersAllCompanies", function () {
        const res = sqlForFilters(filtersAllCompanies)
        expect(res).toEqual("name ILIKE '%cos%' AND num_employees >= 11 AND num_employees <= 110");
    });
    test("filtersHasEquity", function () {
        const res = sqlForFilters({ hasEquity: 'true' })
        expect(res).toEqual("equity > 0");
    });
    test("filtersMinSalary", function () {
        const res = sqlForFilters({ minSalary: 110000 })
        expect(res).toEqual("salary >= 110000");
    });
    test("filtersTitle", function () {
        const res = sqlForFilters({ title: 'jaq' })
        expect(res).toEqual("title ILIKE '%jaq%'");
    });
    test("filtersAllJobs", function () {
        const res = sqlForFilters(filtersAllJobs)
        expect(res).toEqual("title ILIKE '%fli%' AND salary >= 68000");
    });
});

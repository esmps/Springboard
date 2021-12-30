const { sqlForFilters } = require("./filters");

describe("create SQL syntax for company filters", function () {

    const filtersMinMax = {
        minEmployees: 10,
        maxEmployees: 100
    };
    const filtersMin = {
        minEmployees: 5
    }
    const filtersMax = {
        maxEmployees: 342
    }
    const filtersNameLike = {
        nameLike: "net"
    }
    const filtersAll = {
        nameLike: "cos",
        minEmployees: 11,
        maxEmployees: 110
    }

    test("filtersMinMax", function () {
        const res = sqlForFilters(filtersMinMax)
        expect(res).toEqual("num_employees >= 10 AND num_employees <= 100");
    });
    test("filtersMin", function () {
        const res = sqlForFilters(filtersMin)
        expect(res).toEqual("num_employees >= 5");
    });
    test("filtersMax", function () {
        const res = sqlForFilters(filtersMax)
        expect(res).toEqual("num_employees <= 342");
    });
    test("filtersNameLike", function () {
        const res = sqlForFilters(filtersNameLike)
        expect(res).toEqual("name LIKE '%net%'");
    });
    test("filtersAll", function () {
        const res = sqlForFilters(filtersAll)
        expect(res).toEqual("name LIKE '%cos%' AND num_employees >= 11 AND num_employees <= 110");
    });
});

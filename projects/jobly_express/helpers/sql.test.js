const { sqlForPartialUpdate } = require("../helpers/sql");

describe("partialUpdate", function () {

    const dataPartial = {
        name: "Google",
        numEmployees: 10000
    };
    const dataFull = {
        name: "Amazon",
        description: "Everything from A to Z",
        numEmployees: 15000,
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png"
    }
    const dataNull = {
        name: "Meta",
        description: null,
        numEmployees: 5700,
        logoUrl: null
    }

    test("works with partial data", function () {
        const res = sqlForPartialUpdate(dataPartial, {
                                                numEmployees: "num_employees",
                                                logoUrl: "logo_url",
                                                });
        expect(res).toEqual({
            setCols: '"name"=$1, "num_employees"=$2',
            values: ["Google", 10000],
        });
    });
    test("works with full data", function () {
        const res = sqlForPartialUpdate(dataFull, {
                                                numEmployees: "num_employees",
                                                logoUrl: "logo_url",
                                                });
        expect(res).toEqual({
            setCols: '"name"=$1, "description"=$2, "num_employees"=$3, "logo_url"=$4',
            values: ["Amazon", "Everything from A to Z", 15000, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png"],
        });
    });
    test("works with null data", function () {
        const res = sqlForPartialUpdate(dataNull, {
                                                numEmployees: "num_employees",
                                                logoUrl: "logo_url",
                                                });
        expect(res).toEqual({
            setCols: '"name"=$1, "description"=$2, "num_employees"=$3, "logo_url"=$4',
            values: ["Meta", null, 5700, null],
        });
    });
});

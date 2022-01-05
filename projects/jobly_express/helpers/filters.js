//This takes the filter json and returns it formatted for a SQL query

const { BadRequestError } = require("../expressError");

//Takes filters as json
function sqlForFilters(filters) {
    if ((filters.minEmployees && filters.maxEmployees) && (parseInt(filters.minEmployees) > parseInt(filters.maxEmployees))) throw new BadRequestError("minEmployees cannot be greater than maxEmployees");
    //Creates array of data keys
    const keys = Object.keys(filters);
    //Take keys and add value in SQL syntax based on filter
    const values = Object.values(filters);
    //give different WHERE clauses depending on filter name
    const sqlSynt = keys.map((filterName, idx) => {
        if (filterName === "minEmployees") return `num_employees >= ${values[idx]}`;
        else if (filterName === "maxEmployees") return `num_employees <= ${values[idx]}`;
        else if (filterName === "nameLike") return `name ILIKE '%${values[idx]}%'`;
        else if (filterName === "minSalary") return `salary >= ${values[idx]}`;
        else if (filterName === "title") return `title ILIKE '%${values[idx]}%'`;
        else if (filterName === "hasEquity" && values[idx] === true) return `equity > 0`;
    });

    //Join filters by AND so if there are multiple, they will all be included
    return sqlSynt.join(" AND ");
}

module.exports = { sqlForFilters };
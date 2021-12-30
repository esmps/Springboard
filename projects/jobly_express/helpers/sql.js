//This takes only the data you want to update and formats it to be put into a SQL query

const { BadRequestError } = require("../expressError");

//Takes data user wants to update in json format
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  //Creates array of data keys
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  //Take keys and add SQL parameter numbers fo each key.
  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  //Return the (keys + parameter number) and values 
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };

const format = require("pg-format")
const db = require("./db/connection")

exports.checkIfExists = async (table, column, value) => {
    const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
    const { rows } = await db.query(queryStr, [value]);

    if (rows.length === 0 ) {
        return Promise.reject({ status: 404, msg: "This resource was not found"})
    }
};
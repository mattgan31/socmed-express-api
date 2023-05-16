const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:alam@localhost:5432/catalog_express')
// const db = pgp({
//   user: "postgres",
//   password: "alam",
//   host: "localhost",
//   port: "5432",
//   database: "catalog_express"
// })

// async function query(sql, params) {
//   const [result,] = await db.
// }

module.exports = db;

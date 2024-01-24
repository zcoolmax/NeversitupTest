const mysql = require("mysql2/promise"),
  conf = require("../config/database");

const conn = async (sql, values = [], multiple = false) => {
  const conn = await mysql.createConnection(conf.connectionString);
  try {
    const [rows, fields] = await conn.execute(sql, [values], multiple);
    conn.destroy();
    return rows;
  } catch (err) {
    return err;
  }
};

module.exports = {
  conn,
};

const { conn } = require("../database");
const { format } = require("sqlstring");

exports.pdf = function (query) {
  const stringQuery = `
  SELECT 
    cus_id as value,
    cus_company as label,
    cus_id,
    cus_company,
    cus_taxid,
    cus_company,
    CONCAT(cus_address,' ',cus_subDistict,' ',cus_district,' ',cus_province,' ',cus_zipcode) AS cus_address
  FROM 
    customer 
  WHERE 
    cus_number LIKE ? 
    OR cus_company LIKE ? 
    OR cus_name_th LIKE ? 
    OR cus_name_en LIKE ? 
    OR cus_taxid LIKE ? 
  LIMIT 5
  `;
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(`%${query}%`)
  );
  return conn(sql);
};

exports.get_template_by_id = function ({ id }) {
  const stringQuery = `
  SELECT 
    *
  FROM 
    templates 
  WHERE 
    template_id = ?
  `;
  var sql = format(stringQuery, [id]);
  return conn(sql);
};

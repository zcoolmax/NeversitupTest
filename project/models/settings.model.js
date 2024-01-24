const { conn } = require("../database");
const { format } = require("sqlstring");

//////////////////////////////

exports.getZones = function () {
  const stringQuery = `
  SELECT 
    *
  FROM 
    zone
  `;
  var sql = format(stringQuery);
  return conn(sql);
};

exports.addZone = function (post) {
  const stringQuery = format("INSERT INTO zone SET ?", post);
  return conn(stringQuery);
};

exports.editZone = function ({ zone_name, zone_code, zone_id }) {
  const stringQuery = format(
    "UPDATE zone SET zone_name = ?, zone_code = ? WHERE zone_id = ?",
    [zone_name, zone_code, zone_id]
  );
  return conn(stringQuery);
};

exports.getZoneById = function ({ zone_id }) {
  const stringQuery = format("SELECT * FROM zone WHERE zone_id = ? LIMIT 1", [
    zone_id,
  ]);
  return conn(stringQuery);
};
//////////////////////////////

exports.getNationalities = function () {
  const stringQuery = `
  SELECT 
    *
  FROM 
    nationality
  `;
  var sql = format(stringQuery);
  return conn(sql);
};

exports.addNationality = function (post) {
  const stringQuery = format("INSERT INTO nationality SET ?", post);
  return conn(stringQuery);
};

exports.editNationality = function ({
  nationality_name,
  nationality_code,
  nationality_id,
}) {
  const stringQuery = format(
    "UPDATE nationality SET nationality_name = ?, nationality_code = ? WHERE nationality_id = ?",
    [nationality_name, nationality_code, nationality_id]
  );
  return conn(stringQuery);
};

exports.getNationalityById = function ({ nationality_id }) {
  const stringQuery = format(
    "SELECT * FROM nationality WHERE nationality_id = ? LIMIT 1",
    [nationality_id]
  );
  return conn(stringQuery);
};

//////////////////////////////

exports.getBranches = function () {
  const stringQuery = `
  SELECT 
    *
  FROM 
    branch
  `;
  var sql = format(stringQuery);
  return conn(sql);
};

exports.addBranch = function (post) {
  const stringQuery = format("INSERT INTO branch SET ?", post);
  return conn(stringQuery);
};

exports.editBranch = function ({
  branch_name,
  branch_code,
  branch_description,
  branch_id,
  zone_id,
}) {
  const stringQuery = format(
    "UPDATE branch SET branch_name = ?, branch_code = ?, branch_description = ?, zone_id = ? WHERE branch_id = ?",
    [branch_name, branch_code, branch_description, zone_id, branch_id]
  );
  return conn(stringQuery);
};

exports.getBranchById = function ({ branch_id }) {
  const stringQuery = format(
    "SELECT * FROM branch WHERE branch_id = ? LIMIT 1",
    [branch_id]
  );
  return conn(stringQuery);
};
//////////////////////////////

exports.getIndustry = function () {
  const stringQuery = `
  SELECT 
    *
  FROM 
    industry
  `;
  var sql = format(stringQuery);
  return conn(sql);
};

exports.addIndustry = function (post) {
  const stringQuery = format("INSERT INTO industry SET ?", post);
  return conn(stringQuery);
};

exports.editIndustry = function ({ industry_name, industry_id }) {
  const stringQuery = format(
    "UPDATE industry SET industry_name = ? WHERE industry_id = ?",
    [industry_name, industry_id]
  );
  return conn(stringQuery);
};

exports.getIndustryById = function ({ industry_id }) {
  const stringQuery = format(
    "SELECT * FROM industry WHERE industry_id = ? LIMIT 1",
    [industry_id]
  );
  return conn(stringQuery);
};

//////////////////////////////

exports.getCustomers = function () {
  const stringQuery = `
  SELECT 
    *
  FROM 
    customer
    LEFT JOIN nationality ON nationality.nationality_id = customer.nationality_id
    LEFT JOIN industry ON industry.industry_id = customer.industry_id
  `;
  var sql = format(stringQuery);
  return conn(sql);
};

//////////////////////////////

exports.addCustomer = function (post) {
  const stringQuery = format("INSERT INTO customer SET ?", post);
  return conn(stringQuery);
};

exports.editCustomer = function ({
  cus_address,
  nationality_id,
  industry_id,
  cus_taxid,
  cus_name_en,
  cus_name_th,
  cus_sub_distict,
  cus_district,
  cus_province,
  cus_zipcode,
  cus_id,
}) {
  const stringQuery = format(
    "UPDATE customer SET cus_address = ?, nationality_id = ?, industry_id = ?, cus_taxid = ?, cus_name_en = ?, cus_name_th = ?, cus_sub_distict = ?, cus_district = ?, cus_province = ?, cus_zipcode = ? WHERE cus_id = ?",
    [
      cus_address,
      nationality_id,
      industry_id,
      cus_taxid,
      cus_name_en,
      cus_name_th,
      cus_sub_distict,
      cus_district,
      cus_province,
      cus_zipcode,
      cus_id,
    ]
  );
  return conn(stringQuery);
};

exports.getCustomerById = function ({ cus_id }) {
  const stringQuery = format(
    "SELECT * FROM customer LEFT JOIN nationality ON nationality.nationality_id = customer.nationality_id WHERE cus_id = ? LIMIT 1",
    [cus_id]
  );
  return conn(stringQuery);
};

//////////////////////////////

exports.getContractType = function () {
  const stringQuery = `
  SELECT 
    *
  FROM 
    contract_type
  `;
  var sql = format(stringQuery);
  return conn(sql);
};

//////////////////////////////

exports.getTemplate = function () {
  const stringQuery = `
  SELECT 
    *
  FROM 
    templates
  `;
  var sql = format(stringQuery);
  return conn(sql);
};

/*
exports.customer_search = function (query) {
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

exports.customers = function () {
  const stringQuery = `
  SELECT 
    *
  FROM 
    customer
  `;
  var sql = format(stringQuery);
  return conn(sql);
};
*/

const { conn } = require("../database");
const { format } = require("sqlstring");
// const settings_model = require("./settings.model");

exports.query_customer = function (query) {
  const stringQuery = `
  SELECT 
    cus_id as value,
    CASE
      WHEN cus_name_en IS NULL OR cus_name_en = '' THEN cus_name_th
      WHEN cus_name_th IS NULL OR cus_name_th = '' THEN cus_name_en
      ELSE cus_name_th
    END as label,
    cus_id,
    cus_taxid,
    CONCAT(cus_address,' ',cus_sub_distict,' ',cus_district,' ',cus_province,' ',cus_zipcode) AS cus_address
  FROM 
    customer 
  WHERE 
    cus_name_th LIKE ? 
    OR cus_name_en LIKE ? 
    OR cus_taxid LIKE ? 
  `;
  // LIMIT 5
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(`%${query}%`)
  );
  return conn(sql);
};

exports.query_branch = function (query) {
  const stringQuery = `
  SELECT 
    branch_id as value,
    branch_name as label
  FROM 
    branch 
  WHERE 
    branch_name LIKE ? 
    OR branch_code LIKE ? 
  `;
  // LIMIT 5
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(`%${query}%`)
  );
  return conn(sql);
};

exports.query_zone = function (query) {
  const stringQuery = `
  SELECT 
    zone_id as value,
    zone_name as label
  FROM 
    zone 
  WHERE 
    zone_name LIKE ? 
    OR zone_code LIKE ? 
  `;
  // LIMIT 5
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(`%${query}%`)
  );
  return conn(sql);
};

exports.query_building = function (query, document_id) {
  let stringQuery = "";
  if (Array.isArray(query) && query.length) {
    // stringQuery = `
    // SELECT
    //   building_id as value,
    //   CONCAT(building_no, ' ', 'หมู่ ', building_moo, ' ',deed_sub_distict, ' ',deed_district, ' ',deed_province, ' เนื้อที่ ', building_sqm, ' ตรม.') as label
    // FROM
    //   building
    //   LEFT JOIN deed ON building.deed_id = deed.deed_id
    // WHERE
    //   building.deed_id = (SELECT deed_id FROM building WHERE building_id IN (${query}) GROUP BY deed_id)
    // `;
    stringQuery = `
    SELECT
      building.building_id AS value,
      CONCAT( building_no, ' ', 'หมู่ ', building_moo, ' ', deed_sub_distict, ' ', deed_district, ' ', deed_province, ' เนื้อที่ ', building_sqm, ' ตรม.' ) AS label,
      deed.deed_id 
    FROM
      building
      LEFT JOIN deed ON building.deed_id = deed.deed_id 
    WHERE
      building_id NOT IN ( SELECT building_id FROM attached_Building LEFT JOIN document ON document.document_id = attached_building.document_id WHERE NOW() <= document.document_end_date ) 
      AND building.deed_id = (
      SELECT
        deed_id 
      FROM
        building 
      WHERE
        building_id IN ( ${query} ) 
      GROUP BY deed_id 
    )
    OR building_id IN ( SELECT building_id FROM attached_building LEFT JOIN document ON document.document_id = attached_building.document_id WHERE document.document_id = ${document_id}  )
    `;
  } else {
    stringQuery = `
    SELECT
      building.building_id AS value,
      CONCAT( building_no, ' ', 'หมู่ ', building_moo, ' ', deed_sub_distict, ' ', deed_district, ' ', deed_province, ' เนื้อที่ ', building_sqm, ' ตรม.' ) AS label 
    FROM
      building
      LEFT JOIN deed ON building.deed_id = deed.deed_id 
    WHERE
      building_id NOT IN ( SELECT building_id FROM attached_building LEFT JOIN document ON document.document_id = attached_building.document_id WHERE NOW() <= document.document_end_date ) 
      AND (
        building_no LIKE ? 
        OR building_moo LIKE ? 
        OR deed_sub_distict LIKE ? 
        OR deed_district LIKE ? 
        OR deed_province LIKE ? 
        OR building_sqm LIKE ? 
      )
    `;
  }

  // LIMIT 5
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(`%${query}%`)
  );
  return conn(sql);
};

exports.query_nationality = function (query) {
  const stringQuery = `
  SELECT 
    nationality_id as value,
    nationality_name as label
  FROM 
    nationality 
  WHERE 
    nationality_name LIKE ? 
    OR nationality_code LIKE ? 
  `;
  // LIMIT 5
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(`%${query}%`)
  );
  return conn(sql);
};

exports.query_industry = function (query) {
  const stringQuery = `
  SELECT 
    industry_id as value,
    industry_name as label
  FROM 
    industry 
  WHERE 
    industry_name LIKE ?
  `;
  // LIMIT 5
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(`%${query}%`)
  );
  return conn(sql);
};

exports.query_deed = function (query) {
  const stringQuery = `
  SELECT 
    deed_id as value,
    CONCAT('เลขที่โฉนด ',deed_no,' ระวาง ',deed_mapsheet_no,' เลขที่ดิน ',deed_parcel_no,' หน้าสำรวจ ',deed_dealing_file_no,' ',deed_sub_distict,' ',deed_district,' ',deed_province) as label
  FROM 
    deed 
  WHERE 
    deed_no LIKE ? 
    OR deed_mapsheet_no LIKE ? 
    OR deed_parcel_no LIKE ? 
    OR deed_dealing_file_no LIKE ? 
    OR deed_volume LIKE ? 
    OR deed_page LIKE ? 
    OR deed_sub_distict LIKE ? 
    OR deed_district LIKE ? 
    OR deed_province LIKE ? 
    OR deed_rai LIKE ? 
    OR deed_ngan LIKE ? 
    OR deed_sqw LIKE ? 
    OR deed_sqm LIKE ? 
    OR deed_firstname LIKE ? 
    OR deed_lastname LIKE ? 
    OR deed_cus_sub_distict LIKE ? 
    OR deed_cus_district LIKE ? 
    OR deed_cus_province LIKE ? 
    OR deed_cus_zipcode LIKE ? 
  `;
  // LIMIT 5
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(`%${query}%`)
  );
  return conn(sql);
};

exports.query_investment_type = function (query) {
  const stringQuery = `
  SELECT 
    investment_type_id as value,
    investment_type_name as label
  FROM 
    investment_type 
  WHERE 
    investment_type_name LIKE ?
  `;
  // LIMIT 5
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(`%${query}%`)
  );
  return conn(sql);
};

exports.query_building_type = function (query) {
  const stringQuery = `
  SELECT 
    building_type_id as value,
    building_type_name as label
  FROM 
    building_type 
  WHERE 
    building_type_name LIKE ?
  `;
  // LIMIT 5
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(`%${query}%`)
  );
  return conn(sql);
};

exports.query_document_no = function (query) {
  const stringQuery = `
  SELECT 
    document_id as value,
    document_full_no as label
  FROM 
    document 
  WHERE 
    contract_type_id = 1
  `;
  // LIMIT 5
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(`%${query}%`)
  );
  return conn(sql);
};

exports.query_attach_no = function (query) {
  const stringQuery = `
  SELECT 
    document_id as value,
    document_full_no as label
  FROM 
    document 
  WHERE 
    contract_type_id = 2
  `;
  // LIMIT 5
  var sql = format(
    stringQuery,
    Array(stringQuery.split("?").length - 1).fill(`%${query}%`)
  );
  return conn(sql);
};

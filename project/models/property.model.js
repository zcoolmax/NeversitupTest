const { conn } = require("../database");
const { format } = require("sqlstring");

//////////////////////////////

exports.getDeeds = function () {
  const stringQuery = `
  SELECT 
    *
  FROM 
    deed
  `;
  var sql = format(stringQuery);
  return conn(sql);
};

exports.addDeed = function (post) {
  const stringQuery = format("INSERT INTO deed SET ?", post);
  return conn(stringQuery);
};

exports.editDeed = function ({
  deed_no,
  deed_mapsheet_no,
  deed_parcel_no,
  deed_dealing_file_no,
  deed_volume,
  deed_page,
  deed_sub_distict,
  deed_district,
  deed_province,
  deed_rai,
  deed_ngan,
  deed_sqw,
  deed_sqm,
  deed_type,
  deed_date_of_issuance,
  deed_firstname,
  deed_lastname,
  branch_id,
  nationality_id,
  deed_cus_address,
  deed_cus_sub_distict,
  deed_cus_district,
  deed_cus_province,
  deed_cus_zipcode,
  deed_id,
}) {
  const stringQuery = format(
    "UPDATE deed SET deed_no = ?,deed_mapsheet_no = ?,deed_parcel_no = ?,deed_dealing_file_no = ?,deed_volume = ?,deed_page = ?,deed_sub_distict = ?,deed_district = ?,deed_province = ?,deed_rai = ?,deed_ngan = ?,deed_sqw = ?,deed_sqm = ?,deed_type = ?,deed_date_of_issuance = ?,deed_firstname = ?,deed_lastname = ?,branch_id = ?,nationality_id = ?,deed_cus_address = ?,deed_cus_sub_distict = ?,deed_cus_district = ?,deed_cus_province = ?,deed_cus_zipcode = ? WHERE deed_id = ?",
    [
      deed_no,
      deed_mapsheet_no,
      deed_parcel_no,
      deed_dealing_file_no,
      deed_volume,
      deed_page,
      deed_sub_distict,
      deed_district,
      deed_province,
      deed_rai,
      deed_ngan,
      deed_sqw,
      deed_sqm,
      deed_type,
      deed_date_of_issuance,
      deed_firstname,
      deed_lastname,
      branch_id,
      nationality_id,
      deed_cus_address,
      deed_cus_sub_distict,
      deed_cus_district,
      deed_cus_province,
      deed_cus_zipcode,
      deed_id,
    ]
  );
  return conn(stringQuery);
};

exports.getDeedById = function ({ deed_id }) {
  const stringQuery = format("SELECT * FROM deed WHERE deed_id = ? LIMIT 1", [
    deed_id,
  ]);
  return conn(stringQuery);
};

//////////////////////////////

exports.getBuildings = function () {
  const stringQuery = `
  SELECT
    * 
  FROM
    building
    LEFT JOIN deed ON building.deed_id = deed.deed_id
  `;
  var sql = format(stringQuery);
  return conn(sql);
};

exports.addBuilding = function (post) {
  const stringQuery = format("INSERT INTO building SET ?", post);
  return conn(stringQuery);
};

exports.editBuilding = function ({
  building_no,
  building_moo,
  building_sqm,
  deed_id,
  building_id,
  investment_type_id,
  building_type_id,
}) {
  const stringQuery = format(
    "UPDATE building SET building_no = ?,building_moo = ?,building_sqm = ?,deed_id = ?,investment_type_id = ?,building_type_id = ? WHERE building_id = ?",
    [
      building_no,
      building_moo,
      building_sqm,
      deed_id,
      investment_type_id,
      building_type_id,
      building_id,
    ]
  );
  return conn(stringQuery);
};

exports.getBuildingById = function ({ building_id }) {
  const stringQuery = format(
    "SELECT * FROM building LEFT JOIN deed ON building.deed_id = deed.deed_id LEFT JOIN branch ON branch.branch_id = deed.branch_id WHERE building_id = ? LIMIT 1",
    [building_id]
  );
  return conn(stringQuery);
};

exports.getBuildingByDocumentId = function ({ document_id }) {
  const stringQuery = format(
    "SELECT * FROM attached_building WHERE document_id = ?",
    [document_id]
  );
  return conn(stringQuery);
};

exports.getBuildingByArrId = function ({ building_id }) {
  const stringQuery = format(
    "SELECT * FROM building LEFT JOIN deed ON building.deed_id = deed.deed_id WHERE building_id IN (?)",
    [building_id]
  );
  return conn(stringQuery);
};

const { conn } = require("../database");
const { format } = require("sqlstring");
const _ = require("lodash");
const settings_model = require("../models/settings.model");
const property_model = require("../models/property.model");

const padWithLeadingZeros = (num, totalLength = 3) => {
  return String(num).padStart(totalLength, "0");
};

exports.customer_search = function (query) {
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

//////////////////////////////

exports.getDocuments = function () {
  const stringQuery = `
  SELECT 
    *
  FROM 
    document
  `;
  var sql = format(stringQuery);
  return conn(sql);
};

exports.addDocument = async function (post) {
  if (post.contract_type_id == 1) {
    // const { parseDate, prepareData, contract_type_id, template_id } = post;
    const {
      cus_id,
      building_id,
      document_lease_rate,
      document_maintain_fee_rate,
      document_start_date,
      contract_type_id,
      template_id,
    } = post;

    // const {
    //   building_id,
    //   document_lease_rate,
    //   document_maintain_fee_rate,
    //   document_start_date,
    // } = prepareData;

    const buildingArr = await property_model.getBuildingByArrId({
      building_id: building_id,
    });
    const [building] = await property_model.getBuildingById({
      building_id: building_id[0],
    });
    const [customer] = await settings_model.getCustomerById({
      cus_id: cus_id,
    });
    const [MaxDocumentNo] = await this.getMaxDocumentNo({
      document_start_date: document_start_date.substr(0, 4),
      document_branch: customer.branch_code,
      contract_type_id,
    });

    const building_sqm = buildingArr.reduce((cur, item) => {
      return cur + item.building_sqm;
    }, 0);
    const branch_id = building.branch_id;
    const document_sqm = +building_sqm;
    const document_branch = building.branch_code;
    const document_monthly_lease = document_sqm * +document_lease_rate;
    const document_deposit_rental = document_monthly_lease * 3;
    const document_maintain_monthly_fee = document_maintain_fee_rate;
    // const contract_type_id = 1;

    const document_no = padWithLeadingZeros(+MaxDocumentNo.max_document_no + 1);
    const document_year = document_start_date.substr(0, 4);
    const document_cancel_date = "1970-01-01";
    const document_full_no = `HY.${document_branch}.${contract_type_id}.${document_no}/${document_year}`;

    const data = {
      // ...prepareData,
      // document_json: JSON.stringify(parseDate),
      ...post,
      document_cancel_date,
      document_sqm,
      document_monthly_lease,
      document_deposit_rental,
      document_maintain_monthly_fee,
      document_utilities_rate: 0,
      document_year,
      document_full_no,
      document_no,
      document_branch,
      contract_type_id,
      template_id,
      branch_id,
    };

    const thisIsObject = _.omit(data, "building_id");
    const stringQuery = format("INSERT INTO document SET ?", thisIsObject);
    return conn(stringQuery);
  } else {
    const {
      document_id_ref,
      contract_type_id,
      document_utilities_rate,
      template_id,
    } = post;

    if (document_id_ref) {
      const [document] = await this.getDocumentById({
        document_id: document_id_ref,
      });
      const {
        document_branch,
        document_start_date,
        document_end_date,
        cus_id,
        cus_owner_id,
        branch_id,
      } = document;
      // console.log(document);

      const [MaxDocumentNo] = await this.getMaxDocumentNo({
        document_start_date: document_start_date.getFullYear(),
        document_branch,
        contract_type_id,
      });

      const document_no = padWithLeadingZeros(
        +MaxDocumentNo.max_document_no + 1
      );
      const document_year = document_start_date.getFullYear();
      // console.log(document_year, document_start_date);
      const document_cancel_date = "1970-01-01";
      const document_full_no = `HY.${document_branch}.${contract_type_id}.${document_no}/${document_year}`;
      // console.log(document_full_no);

      const insert = {
        document_full_no,
        document_no,
        document_year,
        document_branch,
        document_start_date,
        document_end_date,
        document_cancel_date,
        document_sqm: 0,
        document_lease_rate: 0,
        document_maintain_fee_rate: 0,
        document_maintain_monthly_fee: 0,
        document_monthly_lease: 0,
        document_deposit_rental: 0,
        document_utilities_rate,
        cus_id,
        cus_owner_id,
        branch_id,
        contract_type_id,
        template_id,
        document_id_ref,
      };

      const stringQuery = format("INSERT INTO document SET ?", insert);
      return conn(stringQuery);
    } else {
      const {
        document_id,
        document_period_utility,
        document_period_utility_percent,
        document_period_utility_rate,
        document_utility,
      } = post;
      const insert = {
        document_id,
        document_period_utility,
        document_period_utility_percent,
        document_period_utility_rate,
        document_utility: JSON.stringify(document_utility),
      };

      const stringQuery = format("INSERT INTO attached_utility SET ?", insert);
      return conn(stringQuery);

      return {
        affectedRows: 0,
        sqlMessage: "....",
        insertId: 0,
      };
    }
  }
};

exports.editDocument = async function ({
  document_id,
  document_start_date,
  document_end_date,
  document_cancel_date,
  document_lease_rate,
  document_maintain_fee_rate,
  document_utilities_rate,
  cus_id,
  cus_owner_id,
  building_id,
  contract_type_id,
}) {
  var stringQuery = "";
  if (contract_type_id == 1) {
    const buildingArr = await property_model.getBuildingByArrId({
      building_id: building_id,
    });
    const [building] = await property_model.getBuildingById({
      building_id: building_id[0],
    });
    const building_sqm = buildingArr.reduce((cur, item) => {
      return cur + item.building_sqm;
    }, 0);
    const branch_id = building.branch_id;
    const document_branch = building.branch_code;
    const document_sqm = +building_sqm;
    const document_monthly_lease = document_sqm * +document_lease_rate;
    const document_deposit_rental = document_monthly_lease * 3;
    const document_maintain_monthly_fee = document_maintain_fee_rate;

    stringQuery = format(
      "UPDATE document SET document_start_date = ?,document_end_date = ?,document_cancel_date = ?,document_lease_rate = ?,document_maintain_fee_rate = ?,cus_id = ?,cus_owner_id = ?,document_sqm = ?,branch_id = ?,document_branch = ?,document_monthly_lease = ?,document_deposit_rental = ?,document_maintain_monthly_fee = ? WHERE document_id = ?",
      [
        document_start_date,
        document_end_date,
        document_cancel_date,
        document_lease_rate,
        document_maintain_fee_rate,
        cus_id,
        cus_owner_id,
        document_sqm,
        branch_id,
        document_branch,
        document_monthly_lease,
        document_deposit_rental,
        document_maintain_monthly_fee,
        document_id,
      ]
    );
  } else {
    stringQuery = format(
      "UPDATE document SET document_utilities_rate = ? WHERE document_id = ?",
      [document_utilities_rate, document_id]
    );
  }

  return conn(stringQuery);
};

exports.getDocumentById = function ({ document_id }) {
  const stringQuery = format(
    `
      SELECT * FROM document 
      LEFT JOIN templates ON templates.template_id = document.template_id
      LEFT JOIN contract_type ON templates.contract_type_id = contract_type.contract_type_id
      WHERE document_id = ? LIMIT 1
    `,
    [document_id]
  );
  return conn(stringQuery);
};

exports.getMaxDocumentNo = function ({
  document_start_date,
  document_branch,
  contract_type_id,
}) {
  const stringQuery = format(
    `
    SELECT
      COALESCE(MAX( document_no ), '000') AS max_document_no
    FROM
      document
    WHERE
      document_year = ?
      AND document_branch = ?
      AND contract_type_id = ?
    `,
    [document_start_date, document_branch, contract_type_id]
  );
  return conn(stringQuery);
};

//////////////////////////////

exports.existsAttachedBuilding = function ({ document_id }) {
  const stringQuery = format(
    "SELECT document_id, building_id FROM attached_building WHERE document_id = ?",
    [document_id]
  );
  return conn(stringQuery);
};

exports.addAttachedBuilding = function (post) {
  stringQuery = format("INSERT INTO attached_building SET ?", post);
  return conn(stringQuery);
};

exports.delAttachedBuilding = function ({ document_id }) {
  const stringQuery = format(
    "DELETE FROM attached_building WHERE document_id = ?",
    [document_id]
  );
  return conn(stringQuery);
};

exports.manageAttachedBuilding = async function (post) {
  const { building_id, document_id } = post; // เป็นหลัก
  await this.delAttachedBuilding(post);
  building_id.map(async (val) => {
    await this.addAttachedBuilding({
      building_id: val,
      document_id,
    });
  });
};

exports.getAttachedBuildingById = function ({ document_id }) {
  const stringQuery = format(
    `
      SELECT building_id FROM attached_building 
      WHERE document_id = ?
    `,
    [document_id]
  );
  return conn(stringQuery);
};

const settings_model = require("../models/settings.model");

// ** Returns paginated array
const paginateArray = (array, perPage, page) =>
  array.slice((page - 1) * perPage, page * perPage);

//////////////////////////////

exports.getZones = async function ({ body }, res) {
  const zones = await settings_model.getZones();
  const { sort, q, sortColumn, page, perPage, status } = body;
  const dataAsc = zones.sort((a, b) =>
    a[sortColumn] < b[sortColumn] ? -1 : 1
  );
  const dataToFilter = sort === "asc" ? dataAsc : dataAsc.reverse();
  const queryLowered = q.toLowerCase();
  const filteredData = dataToFilter.filter((zone) => {
    return (
      zone.zone_name.toLowerCase().includes(queryLowered) ||
      zone.zone_code.toLowerCase().includes(queryLowered)
    );
  });
  res.status(200).json({
    total: filteredData.length,
    zones:
      filteredData.length <= perPage
        ? filteredData
        : paginateArray(filteredData, perPage, page),
  });
};
exports.addZone = async function ({ body }, res) {
  const { affectedRows = 0, sqlMessage = "" } = await settings_model.addZone(
    body
  );
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};
exports.editZone = async function ({ body }, res) {
  const { affectedRows = 0, sqlMessage = "" } = await settings_model.editZone(
    body
  );
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};
exports.getZoneById = async function ({ body }, res) {
  const [zone] = await settings_model.getZoneById(body);
  res.status(200).json({
    zone,
  });
};

//////////////////////////////

exports.getNationalities = async function ({ body }, res) {
  const nationalities = await settings_model.getNationalities();
  const { sort, q, sortColumn, page, perPage, status } = body;
  const dataAsc = nationalities.sort((a, b) =>
    a[sortColumn] < b[sortColumn] ? -1 : 1
  );
  const dataToFilter = sort === "asc" ? dataAsc : dataAsc.reverse();
  const queryLowered = q.toLowerCase();
  const filteredData = dataToFilter.filter((nationality) => {
    return (
      nationality.nationality_name.toLowerCase().includes(queryLowered) ||
      nationality.nationality_code.toLowerCase().includes(queryLowered)
    );
  });
  res.status(200).json({
    total: filteredData.length,
    nationalities:
      filteredData.length <= perPage
        ? filteredData
        : paginateArray(filteredData, perPage, page),
  });
};
exports.addNationality = async function ({ body }, res) {
  const { affectedRows = 0, sqlMessage = "" } =
    await settings_model.addNationality(body);
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};
exports.editNationality = async function ({ body }, res) {
  const { affectedRows = 0, sqlMessage = "" } =
    await settings_model.editNationality(body);
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};
exports.getNationalityById = async function ({ body }, res) {
  const [nationality] = await settings_model.getNationalityById(body);
  res.status(200).json({
    nationality,
  });
};

//////////////////////////////

exports.getBranches = async function ({ body }, res) {
  const branches = await settings_model.getBranches();
  const { sort, q, sortColumn, page, perPage, status } = body;
  const dataAsc = branches.sort((a, b) =>
    a[sortColumn] < b[sortColumn] ? -1 : 1
  );
  const dataToFilter = sort === "asc" ? dataAsc : dataAsc.reverse();
  const queryLowered = q.toLowerCase();
  const filteredData = dataToFilter.filter((branch) => {
    return (
      branch.branch_name.toLowerCase().includes(queryLowered) ||
      branch.branch_code.toLowerCase().includes(queryLowered)
    );
  });
  res.status(200).json({
    total: filteredData.length,
    branches:
      filteredData.length <= perPage
        ? filteredData
        : paginateArray(filteredData, perPage, page),
  });
};
exports.addBranch = async function ({ body }, res) {
  const { affectedRows = 0, sqlMessage = "" } = await settings_model.addBranch(
    body
  );
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};
exports.editBranch = async function ({ body }, res) {
  const { affectedRows = 0, sqlMessage = "" } = await settings_model.editBranch(
    body
  );
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};
exports.getBranchById = async function ({ body }, res) {
  const [branch] = await settings_model.getBranchById(body);
  res.status(200).json({
    branch: branch,
  });
};
//////////////////////////////

exports.getIndustry = async function ({ body }, res) {
  const industry = await settings_model.getIndustry();
  const { sort, q, sortColumn, page, perPage, status } = body;
  const dataAsc = industry.sort((a, b) =>
    a[sortColumn] < b[sortColumn] ? -1 : 1
  );
  const dataToFilter = sort === "asc" ? dataAsc : dataAsc.reverse();
  const queryLowered = q.toLowerCase();
  const filteredData = dataToFilter.filter((industry) => {
    return industry.industry_name.toLowerCase().includes(queryLowered);
  });
  res.status(200).json({
    total: filteredData.length,
    industry:
      filteredData.length <= perPage
        ? filteredData
        : paginateArray(filteredData, perPage, page),
  });
};
exports.addIndustry = async function ({ body }, res) {
  const { affectedRows = 0, sqlMessage = "" } =
    await settings_model.addIndustry(body);
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};
exports.editIndustry = async function ({ body }, res) {
  const { affectedRows = 0, sqlMessage = "" } =
    await settings_model.editIndustry(body);
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};
exports.getIndustryById = async function ({ body }, res) {
  const [industry] = await settings_model.getIndustryById(body);
  res.status(200).json({
    industry: industry,
  });
};

//////////////////////////////

exports.getCustomers = async function ({ body }, res) {
  const customers = await settings_model.getCustomers();
  const { sort, q, sortColumn, page, perPage, status } = body;
  const dataAsc = customers.sort((a, b) =>
    a[sortColumn] < b[sortColumn] ? -1 : 1
  );
  const dataToFilter = sort === "asc" ? dataAsc : dataAsc.reverse();
  const queryLowered = q.toLowerCase();
  const filteredData = dataToFilter.filter((customer) => {
    return (
      (String(customer.cus_number).toLowerCase().includes(queryLowered) ||
        customer.cus_company.toLowerCase().includes(queryLowered) ||
        customer.cus_address.toLowerCase().includes(queryLowered) ||
        customer.cus_subDistict.toLowerCase().includes(queryLowered) ||
        customer.cus_district.toLowerCase().includes(queryLowered) ||
        customer.cus_province.toLowerCase().includes(queryLowered) ||
        customer.cus_zipcode.toLowerCase().includes(queryLowered) ||
        customer.cus_taxid.toLowerCase().includes(queryLowered)) &&
      String(customer.cus_park_id) === (status || String(customer.cus_park_id))
    );
  });
  res.status(200).json({
    total: filteredData.length,
    customers:
      filteredData.length <= perPage
        ? filteredData
        : paginateArray(filteredData, perPage, page),
  });
};
exports.addCustomer = async function ({ body }, res) {
  const { affectedRows = 0, sqlMessage = "" } =
    await settings_model.addCustomer(body);
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};
exports.editCustomer = async function ({ body }, res) {
  const { affectedRows = 0, sqlMessage = "" } =
    await settings_model.editCustomer(body);
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};
exports.getCustomerById = async function ({ body }, res) {
  const [customers] = await settings_model.getCustomerById(body);
  res.status(200).json({
    customers: customers,
  });
};

//////////////////////////////

exports.getContractType = async function ({ body }, res) {
  const contractType = await settings_model.getContractType();
  const { sort, q, sortColumn, page, perPage, status } = body;
  const dataAsc = contractType.sort((a, b) =>
    a[sortColumn] < b[sortColumn] ? -1 : 1
  );
  const dataToFilter = sort === "asc" ? dataAsc : dataAsc.reverse();
  const queryLowered = q.toLowerCase();
  const filteredData = dataToFilter.filter((contractType) => {
    return contractType.contract_type_name.toLowerCase().includes(queryLowered);
  });
  res.status(200).json({
    total: filteredData.length,
    contractType:
      filteredData.length <= perPage
        ? filteredData
        : paginateArray(filteredData, perPage, page),
  });
};

//////////////////////////////

exports.getTemplate = async function ({ body }, res) {
  const template = await settings_model.getTemplate();
  const { sort, q, sortColumn, page, perPage, status } = body;
  const dataAsc = template.sort((a, b) =>
    a[sortColumn] < b[sortColumn] ? -1 : 1
  );
  const dataToFilter = sort === "asc" ? dataAsc : dataAsc.reverse();
  const queryLowered = q.toLowerCase();
  const filteredData = dataToFilter.filter((template) => {
    return (
      template.template_name.toLowerCase().includes(queryLowered) ||
      String(template.contract_type_id).toLowerCase().includes(queryLowered)
    );
  });
  res.status(200).json({
    total: filteredData.length,
    template:
      filteredData.length <= perPage
        ? filteredData
        : paginateArray(filteredData, perPage, page),
  });
};

// error message
// {
//   "message": "Data too long for column 'branch_code' at row 1",
//   "code": "ER_DATA_TOO_LONG",
//   "errno": 1406,
//   "sql": "INSERT INTO branch SET `branch_name` = 'ทดสอบ', `branch_code` = 'Test'",
//   "sqlState": "22001",
//   "sqlMessage": "Data too long for column 'branch_code' at row 1"
// }

// success message
// {
//   "fieldCount": 0,
//   "affectedRows": 1,
//   "insertId": 3,
//   "info": "",
//   "serverStatus": 2,
//   "warningStatus": 0
// }

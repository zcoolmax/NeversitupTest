const property_model = require("../models/property.model");

// ** Returns paginated array
const paginateArray = (array, perPage, page) =>
  array.slice((page - 1) * perPage, page * perPage);

//////////////////////////////

exports.getDeeds = async function ({ body }, res) {
  const deeds = await property_model.getDeeds();
  const { sort, q, sortColumn, page, perPage, status } = body;
  const dataAsc = deeds.sort((a, b) =>
    a[sortColumn] < b[sortColumn] ? -1 : 1
  );
  const dataToFilter = sort === "asc" ? dataAsc : dataAsc.reverse();
  const queryLowered = q.toLowerCase();
  const filteredData = dataToFilter.filter((deed) => {
    return (
      deed.deed_firstname.toLowerCase().includes(queryLowered) ||
      deed.deed_lastname.toLowerCase().includes(queryLowered) ||
      deed.deed_date_of_issuance.toString().includes(queryLowered) ||
      deed.deed_no.toString().includes(queryLowered) ||
      deed.deed_mapsheet_no.toString().includes(queryLowered) ||
      deed.deed_parcel_no.toString().includes(queryLowered) ||
      deed.deed_dealing_file_no.toString().includes(queryLowered) ||
      deed.deed_volume.toString().includes(queryLowered) ||
      deed.deed_page.toString().includes(queryLowered)
    );
  });
  res.status(200).json({
    total: filteredData.length,
    deeds:
      filteredData.length <= perPage
        ? filteredData
        : paginateArray(filteredData, perPage, page),
  });
};
exports.addDeed = async function ({ body }, res) {
  const { affectedRows = 0, sqlMessage = "" } = await property_model.addDeed(
    body
  );
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};
exports.editDeed = async function ({ body }, res) {
  const { affectedRows = 0, sqlMessage = "" } = await property_model.editDeed(
    body
  );
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};
exports.getDeedById = async function ({ body }, res) {
  const [deed] = await property_model.getDeedById(body);
  res.status(200).json({
    deed,
  });
};

//////////////////////////////

exports.getBuildings = async function ({ body }, res) {
  const buildings = await property_model.getBuildings();
  const { sort, q, sortColumn, page, perPage, status } = body;
  const dataAsc = buildings.sort((a, b) =>
    a[sortColumn] < b[sortColumn] ? -1 : 1
  );
  const dataToFilter = sort === "asc" ? dataAsc : dataAsc.reverse();
  const queryLowered = q.toLowerCase();
  const filteredData = dataToFilter.filter((building) => {
    return (
      building.building_no.toLowerCase().includes(queryLowered) ||
      building.building_moo.toString().includes(queryLowered) ||
      building.building_sqm.toString().includes(queryLowered)
    );
  });
  res.status(200).json({
    total: filteredData.length,
    buildings:
      filteredData.length <= perPage
        ? filteredData
        : paginateArray(filteredData, perPage, page),
  });
};
exports.addBuilding = async function ({ body }, res) {
  const { affectedRows = 0, sqlMessage = "" } =
    await property_model.addBuilding(body);
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};
exports.editBuilding = async function ({ body }, res) {
  const { affectedRows = 0, sqlMessage = "" } =
    await property_model.editBuilding(body);
  res.status(200).json({
    affectedRows,
    sqlMessage,
  });
};
exports.getBuildingById = async function ({ body }, res) {
  const [building] = await property_model.getBuildingById(body);
  res.status(200).json({
    building,
  });
};

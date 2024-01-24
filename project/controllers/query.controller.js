const query_model = require("../models/query.model");

exports.query_customer = async function ({ body: { query } }, res) {
  const customers = await query_model.query_customer(query);
  res.status(200).json(customers);
};

exports.query_branch = async function ({ body: { query } }, res) {
  const branches = await query_model.query_branch(query);
  res.status(200).json(branches);
};

exports.query_zone = async function ({ body: { query } }, res) {
  const zone = await query_model.query_zone(query);
  res.status(200).json(zone);
};

exports.query_building = async function (
  { body: { query, document_id = null } },
  res
) {
  const buildings = await query_model.query_building(query, document_id);
  res.status(200).json(buildings);
};

exports.query_nationality = async function ({ body: { query } }, res) {
  const nationality = await query_model.query_nationality(query);
  res.status(200).json(nationality);
};

exports.query_industry = async function ({ body: { query } }, res) {
  const nationality = await query_model.query_industry(query);
  res.status(200).json(nationality);
};

exports.query_deed = async function ({ body: { query } }, res) {
  const deed = await query_model.query_deed(query);
  res.status(200).json(deed);
};

exports.query_investment_type = async function ({ body: { query } }, res) {
  const investment_type = await query_model.query_investment_type(query);
  res.status(200).json(investment_type);
};

exports.query_building_type = async function ({ body: { query } }, res) {
  const building_type = await query_model.query_building_type(query);
  res.status(200).json(building_type);
};

exports.query_document_no = async function ({ body: { query } }, res) {
  const document = await query_model.query_document_no(query);
  res.status(200).json(document);
};
exports.query_attach_no = async function ({ body: { query } }, res) {
  const attach = await query_model.query_attach_no(query);
  res.status(200).json(attach);
};

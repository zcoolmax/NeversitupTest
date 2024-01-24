const express = require("express");
const router = express.Router();

const query_controller = require("../controllers/query.controller");

router.post("/query_customer", query_controller.query_customer);
router.post("/query_branch", query_controller.query_branch);
router.post("/query_zone", query_controller.query_zone);
router.post("/query_building", query_controller.query_building);
router.post("/query_nationality", query_controller.query_nationality);
router.post("/query_industry", query_controller.query_industry);
router.post("/query_deed", query_controller.query_deed);
router.post("/query_investment_type", query_controller.query_investment_type);
router.post("/query_building_type", query_controller.query_building_type);
router.post("/query_document_no", query_controller.query_document_no);
router.post("/query_attach_no", query_controller.query_attach_no);

module.exports = router;

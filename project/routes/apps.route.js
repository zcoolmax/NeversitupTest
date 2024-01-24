const express = require("express");
const router = express.Router();

const contract_controller = require("../controllers/contract.controller");

router.post("/customer/getCustomer", contract_controller.getCustomer);
// router.post("/customer_search", contract_controller.customer_search);

module.exports = router;

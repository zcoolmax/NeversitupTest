const express = require("express");
const router = express.Router();

const contract_controller = require("../controllers/contract.controller");

// router.get("/customers", contract_controller.customers);

router.post("/getDocuments", contract_controller.getDocuments);
router.post("/addDocument", contract_controller.addDocument);
router.post("/editDocument", contract_controller.editDocument);

router.post("/getDocumentById", contract_controller.getDocumentById);

module.exports = router;

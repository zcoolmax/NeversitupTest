const express = require("express");
const router = express.Router();

const settings_controller = require("../controllers/settings.controller");

router.post("/getContractType", settings_controller.getContractType);
router.post("/getTemplate", settings_controller.getTemplate);

router.post("/getZones", settings_controller.getZones);
router.post("/addZone", settings_controller.addZone);
router.post("/editZone", settings_controller.editZone);
router.post("/getZoneById", settings_controller.getZoneById);

router.post("/getNationalities", settings_controller.getNationalities);
router.post("/addNationality", settings_controller.addNationality);
router.post("/editNationality", settings_controller.editNationality);
router.post("/getNationalityById", settings_controller.getNationalityById);

router.post("/getBranches", settings_controller.getBranches);
router.post("/addBranch", settings_controller.addBranch);
router.post("/editBranch", settings_controller.editBranch);
router.post("/getBranchById", settings_controller.getBranchById);

router.post("/getIndustry", settings_controller.getIndustry);
router.post("/addIndustry", settings_controller.addIndustry);
router.post("/editIndustry", settings_controller.editIndustry);
router.post("/getIndustryById", settings_controller.getIndustryById);

router.post("/getCustomers", settings_controller.getCustomers);
router.post("/addCustomer", settings_controller.addCustomer);
router.post("/editCustomer", settings_controller.editCustomer);
router.post("/getCustomerById", settings_controller.getCustomerById);

module.exports = router;

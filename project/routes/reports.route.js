const express = require("express");
const router = express.Router();

const reports_controller = require("../controllers/reports.controller");

router.post("/getExportDocument", reports_controller.getExportDocument);

router.post("/getLeaseExpiry", reports_controller.getLeaseExpiry);
router.post("/getProportion", reports_controller.getProportion);
router.post("/getProportionBySize", reports_controller.getProportionBySize);
router.post("/getProportionByType", reports_controller.getProportionByType);
router.post("/getRentalRateOcc", reports_controller.getRentalRateOcc);
router.post("/getTimeRange", reports_controller.getTimeRange);

router.post("/getReportFirst", reports_controller.getReportFirst);
router.post("/getReportSecond", reports_controller.getReportSecond);
router.post("/getReportThird", reports_controller.getReportThird);

// router.get("/customers", contract_controller.customers);
// router.get("/getBranches", settings_controller.getBranches);
// router.post("/getBranches", settings_controller.getBranches);
// router.post("/addBranch", settings_controller.addBranch);
// router.post("/editBranch", settings_controller.editBranch);
// router.post("/getBranchById", settings_controller.getBranchById);

// router.post("/getCustomers", settings_controller.getCustomers);
// router.post("/addCustomer", settings_controller.addCustomer);
// router.post("/editCustomer", settings_controller.editCustomer);
// router.post("/getCustomerById", settings_controller.getCustomerById);

module.exports = router;

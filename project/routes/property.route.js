const express = require("express");
const router = express.Router();

const property_controller = require("../controllers/property.controller");

// router.get("/customers", contract_controller.customers);
// router.get("/getZones", property_controller.getZones);
router.post("/getDeeds", property_controller.getDeeds);
router.post("/addDeed", property_controller.addDeed);
router.post("/editDeed", property_controller.editDeed);
router.post("/getDeedById", property_controller.getDeedById);

// router.get("/getNationalities", property_controller.getNationalities);
router.post("/getBuildings", property_controller.getBuildings);
router.post("/addBuilding", property_controller.addBuilding);
router.post("/editBuilding", property_controller.editBuilding);
router.post("/getBuildingById", property_controller.getBuildingById);

module.exports = router;

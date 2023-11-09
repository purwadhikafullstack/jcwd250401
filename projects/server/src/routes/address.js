const express = require("express");
const router = express.Router();

const addressController = require("../controller/address");

router.get("/province", addressController.handleGetProvince)
router.get("/city/:id", addressController.handleGetCityByProvinceId)
router.get("/city", addressController.handleGetCity)
router.post("/cost", addressController.handleGetCost)

module.exports = router
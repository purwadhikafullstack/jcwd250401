const express = require("express");
const router = express.Router();

const warehouseController = require("../controller/warehouseController");
const warehouseValidation = require("../middleware/validation/warehouse");
const authMiddleware = require("../middleware/auth");

router.get(
    "/", 
    authMiddleware.validateToken,
    warehouseController.getAllWarehouses);

router.post(
    "/",
    authMiddleware.validateToken,
    warehouseValidation.addWarehouseValidationRules,
    warehouseValidation.applyAddWarehouseValidation,
    warehouseController.addWarehouse);

module.exports = router;
const express = require("express");
const router = express.Router();

const warehouseController = require("../controller/warehouseController");
const warehouseValidation = require("../middleware/validation/warehouse");
const authMiddleware = require("../middleware/auth");
const { multerUpload } = require("../lib/multer");

router.get(
    "/", 
    authMiddleware.validateToken,
    warehouseController.getAllWarehouses);

router.post(
    "/",
    authMiddleware.validateToken,
    multerUpload.single("warehouseImage"),
    warehouseValidation.WarehouseValidationRules,
    warehouseValidation.applyWarehouseValidation,
    warehouseController.addWarehouse);

router.patch(
    "/:id",
    authMiddleware.validateToken,
    multerUpload.single("warehouseImage"),
    warehouseController.updateWarehouse);

router.delete(
    "/:id",
    authMiddleware.validateToken,
    warehouseController.deleteWarehouse);

module.exports = router;
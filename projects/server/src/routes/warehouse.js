const express = require("express");
const router = express.Router();

const warehouseController = require("../controller/warehouseController");
const authMiddleware = require("../middleware/auth");

router.get(
    "/", 
    authMiddleware.validateToken,
    warehouseController.getAllWarehouses);

module.exports = router;
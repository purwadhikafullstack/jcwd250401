const express = require("express");
const router = express.Router();

const mutationController = require("../controller/mutation");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware.validateToken, mutationController.getAllMutations);
router.get("/stock/:productId/:warehouseId", authMiddleware.validateToken, mutationController.getTotalStockByWarehouseProductId);

module.exports = router;

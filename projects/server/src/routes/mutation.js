const express = require("express");
const router = express.Router();

const mutationController = require("../controller/mutation");
const authMiddleware = require("../middleware/auth");

router.post("/stock/manual-mutation", authMiddleware.validateToken, mutationController.createManualStockMutation);
router.post("/stock/process-mutation", authMiddleware.validateToken, mutationController.processStockMutationByWarehouse);
router.get("/", authMiddleware.validateToken, mutationController.getAllMutations);
router.get("/total-stock", authMiddleware.validateToken, mutationController.summaryTotalStock);
router.get("/journal", authMiddleware.validateToken, mutationController.getAllMutationsJournal);
router.get("/stock/:productId/:warehouseId", authMiddleware.validateToken, mutationController.getTotalStockByWarehouseProductId);
router.get("/order-data", authMiddleware.validateToken, mutationController.testGetOrderData);
router.get("/warehouses", authMiddleware.validateToken, mutationController.testGetWarehouses);
router.get("/nearest-warehouse", authMiddleware.validateToken, mutationController.testFindNearestWarehouse);
// router.patch("/test-confirm-payment", authMiddleware.validateToken, mutationController.testConfirmPaymentProofUser);

module.exports = router;

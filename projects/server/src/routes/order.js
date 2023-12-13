const express = require("express");
const router = express.Router();

const orderController = require("../controller/order");
const { multerUpload } = require("../lib/multer");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware.validateToken, orderController.getAllOrderLists);
router.get("/:userId", authMiddleware.validateToken, orderController.getOrderLists);
router.put("/:userId/:id", authMiddleware.validateToken, multerUpload.single("paymentProofImage"), orderController.paymentProof);
router.post("/cost", authMiddleware.validateToken, orderController.getOrderCost);
router.post("/", authMiddleware.validateToken, orderController.createOrder);
module.exports = router;

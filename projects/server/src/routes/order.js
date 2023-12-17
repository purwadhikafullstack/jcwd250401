const express = require("express");
const router = express.Router();

const orderController = require("../controller/order");
const { multerUpload } = require("../lib/multer");
const authMiddleware = require("../middleware/auth");
const schedule = require("node-schedule");

router.get("/", authMiddleware.validateToken, orderController.getAllOrderLists);
router.get("/my-order", authMiddleware.validateToken, orderController.getOrderLists);
router.put("/:userId/:id", authMiddleware.validateToken, multerUpload.single("paymentProofImage"), orderController.paymentProof);
router.post("/cost", authMiddleware.validateToken, orderController.getOrderCost);
router.post("/", authMiddleware.validateToken, orderController.createOrder);
router.patch("/confirm-payment", authMiddleware.validateToken, orderController.confirmPaymentProofUser);
router.patch("/:id", authMiddleware.validateToken, orderController.confirmPayment);
router.patch("/reject/:id", authMiddleware.validateToken, orderController.rejectPayment);

// Automatic cancellation of unpaid orders testing 1 min interval

// Schedule job to run every 10 minutes
schedule.scheduleJob('*/10 * * * *', async () => {
    try {
      // Call your function to automatically cancel unpaid orders
      await orderController.automaticCancelUnpaidOrder();
      console.log('Automatic cancel job executed successfully');
    } catch (error) {
      console.error('Error executing automatic cancel job:', error);
    }
  });


module.exports = router;

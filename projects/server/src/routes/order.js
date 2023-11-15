const express = require("express");
const router = express.Router();

const orderController = require("../controller/order");
const { multerUpload } = require("../lib/multer");

router.get("/",orderController.getAllOrder);
router.put("/:userId/:id",multerUpload.single("paymentProofImage"), orderController.paymentProof);

module.exports = router;

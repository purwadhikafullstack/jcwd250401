const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart");
const authMiddleware = require("../middleware/auth");


router.post("/", authMiddleware.validateToken, cartController.handleAddToCart);
router.get("/", authMiddleware.validateToken, cartController.handleGetCart);
router.delete("/:productId", authMiddleware.validateToken, cartController.handleDeleteCartItem);


module.exports = router;
const express = require("express");
const router = express.Router();
const wishlistController = require("../controller/wishlist");
const authMiddleware = require("../middleware/auth");



router.post("/", authMiddleware.validateToken, wishlistController.handleAddToWishlist);
router.get("/", authMiddleware.validateToken, wishlistController.handleGetWishlist);
router.delete("/:productId", authMiddleware.validateToken, wishlistController.handleDeleteWishlistProduct);


module.exports = router;
const express = require("express");
const router = express.Router();

const addressController = require("../controller/address");
const authMiddleware = require("../middleware/auth");

router.get("/city", authMiddleware.validateToken,addressController.handleGetCity);
router.get("/province", authMiddleware.validateToken,addressController.handleGetProvince);
router.get("/city/:id", authMiddleware.validateToken,addressController.handleGetCityByProvinceId);
router.get("/:userId", authMiddleware.validateToken,addressController.handleGetSingleUserAddress);
router.get("/:userId/:addressId", authMiddleware.validateToken,addressController.handleGetSpesificUserAddress);
router.post("/:userId", authMiddleware.validateToken,addressController.handleAddNewAddress);
router.delete("/:userId/:addressId", authMiddleware.validateToken,addressController.handleDeleteAddress);
router.patch("/:userId/:addressId", authMiddleware.validateToken,addressController.handleUpdateAddress);

module.exports = router;

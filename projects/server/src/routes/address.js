const express = require("express");
const router = express.Router();

const addressController = require("../controller/address");

router.get("/city", addressController.handleGetCity);
router.get("/province", addressController.handleGetProvince);
router.get("/city/:id", addressController.handleGetCityByProvinceId);
router.get("/:userId", addressController.handleGetSingleUserAddress);
router.get("/:userId/:addressId", addressController.handleGetSpesificUserAddress);
router.post("/:userId", addressController.handleAddNewAddress);
router.delete("/:userId/:addressId", addressController.handleDeleteAddress);
router.patch("/:userId/:addressId", addressController.handleUpdateAddress);

module.exports = router;

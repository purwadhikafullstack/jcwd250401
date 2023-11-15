const express = require("express");
const router = express.Router();

const { multerUpload } = require("../lib/multer");
const productController = require("../controller/product");
const productValidator = require("../middleware/validation/product");

router.post("/", multerUpload.array("productImages", 5), productValidator.productValidationRules, productValidator.applyProductValidation, productController.handleAddProduct);
router.get("/", productController.handleGetAllProducts)

module.exports = router;

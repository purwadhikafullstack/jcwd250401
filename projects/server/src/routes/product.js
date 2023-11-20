const express = require("express");
const router = express.Router();

const { multerUpload } = require("../lib/multer");
const productController = require("../controller/product");
const productValidator = require("../middleware/validation/product");

router.post("/", multerUpload.array("productImages", 5), productValidator.productValidationRules, productValidator.applyProductValidation, productController.handleAddProduct);
router.put("/:productId", multerUpload.array("productImages", 5), productValidator.productValidationRules, productValidator.applyProductValidation, productController.handleUpdateProduct);
router.get("/", productController.handleGetAllProducts)
router.put("/archive/:productId", productController.handleArchiveProduct);
router.put("/unarchive/:productId", productController.handleUnarchiveProduct);
router.delete("/:productId", productController.handleDeleteProduct);

module.exports = router;

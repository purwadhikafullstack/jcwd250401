const express = require("express");
const router = express.Router();

const { multerUpload } = require("../lib/multer");
const productController = require("../controller/product");
const productValidator = require("../middleware/validation/product");
const authMiddleware = require("../middleware/auth")

router.post("/", authMiddleware.validateToken, authMiddleware.checkRoleSuperAdmin, multerUpload.array("productImages", 5), productValidator.productValidationRules, productValidator.applyProductValidation, productController.handleAddProduct);

router.put("/:productId", authMiddleware.validateToken, authMiddleware.checkRoleSuperAdmin,  multerUpload.array("productImages", 5), productValidator.productValidationRules, productValidator.applyProductValidation, productController.handleUpdateProduct);

router.get("/", authMiddleware.validateToken, productController.handleGetAllProducts)

router.put("/archive/:productId", authMiddleware.validateToken, authMiddleware.checkRoleSuperAdmin, productController.handleArchiveProduct);

router.put("/unarchive/:productId", authMiddleware.validateToken, authMiddleware.checkRoleSuperAdmin, productController.handleUnarchiveProduct);

router.delete("/:productId", authMiddleware.validateToken, authMiddleware.checkRoleSuperAdmin, productController.handleDeleteProduct);

// for client side
router.get("/user", productController.handleGetAllProducts);


module.exports = router;

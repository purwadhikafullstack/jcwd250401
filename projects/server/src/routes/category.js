const express = require("express");
const router = express.Router();

const categoryController = require("../controller/category");
const categoryValidation = require("../middleware/validation/category");
const authMiddleware = require("../middleware/auth")

router.post("/", authMiddleware.validateToken,categoryValidation.validateCategory, categoryController.createCategory);
router.put("/:id", authMiddleware.validateToken,categoryValidation.validateCategory, categoryController.editCategory);
router.delete("/:id", authMiddleware.validateToken,categoryController.deleteCategory);
router.get("/", authMiddleware.validateToken,categoryController.getCategories);
router.get("/sub-categories", authMiddleware.validateToken,categoryController.handleGetSubCategory);
router.get("/child-categories", authMiddleware.validateToken,categoryController.handleGetCategoriesWithSubcategories);

module.exports = router;

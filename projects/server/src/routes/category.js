const express = require("express");
const router = express.Router();

const categoryController = require("../controller/category");
const categoryValidation = require("../middleware/validation/category");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware.validateToken, categoryValidation.validateCategory, categoryController.createCategory);
router.put("/:id", authMiddleware.validateToken, categoryValidation.validateCategory, categoryController.editCategory);
router.delete("/:id", authMiddleware.validateToken, categoryController.deleteCategory);
router.get("/", categoryController.getCategories);
router.get("/sub-categories", categoryController.handleGetSubCategory);
router.get("/child-categories", categoryController.handleGetCategoriesWithSubcategories);

// for client side
router.get("/user", categoryController.getCategories);
router.get("/user/sub-categories", categoryController.handleGetSubCategory);
router.get("/user/child-categories", categoryController.handleGetCategoriesWithSubcategories);

module.exports = router;

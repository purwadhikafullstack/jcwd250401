const express = require("express");
const router = express.Router();

const categoryController = require("../controller/category");
const categoryValidation = require("../middleware/validation/category");

router.post("/", categoryValidation.validateCategory, categoryController.createCategory);
router.put("/:id", categoryValidation.validateCategory, categoryController.editCategory);
router.delete("/:id", categoryController.deleteCategory);
router.get("/", categoryController.getCategories);
router.get("/subcategories", categoryController.getCategorySubcategories);

module.exports = router;

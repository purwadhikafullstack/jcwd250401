const { validationResult } = require("express-validator");
const { Category } = require("../models");

exports.createCategory = async (req, res) => {
  let { name, mainCategory } = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({
        ok: false,
        message: "Validation error",
        detail: errors.array(),
      });
    }

    let parentCategoryId;
    switch (true) {
      case mainCategory === "Jackets":
        parentCategoryId = 1;
        break;
      case mainCategory === "Tops":
        parentCategoryId = 2;
        break;
      case mainCategory === "Bottom":
        parentCategoryId = 3;
        break;
      case mainCategory === "Bags":
        parentCategoryId = 4;
        break;
      case mainCategory === "Accessories":
        parentCategoryId = 5;
        break;
      default:
        return res.status(400).json({
          ok: false,
          message: "Invalid mainCategory",
        });
    }

    const category = await Category.findOne({
      where: {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        parentCategoryId,
      },
    });

    if (category) {
      return res.status(403).json({
        ok: false,
        message: "Category already exists",
      });
    }

    const newCategory = await Category.create({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      parentCategoryId,
    });

    return res.status(201).json({
      ok: true,
      message: "Category created successfully",
      detail: newCategory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Interal server error",
    });
  }
};

exports.editCategory = async (req, res) => {
  const { id } = req.params;
  let { name, mainCategory } = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({
        ok: false,
        message: "Validation error",
        detail: errors.array(),
      });
    }
    
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        ok: false,
        message: "Category not found",
      });
    }
    
    if (mainCategory === "" || mainCategory === undefined) {
      return res.status(400).json({
        ok: false,
        message: "Main category is a required parameter.",
      });
    }

    if (category.parentCategoryId === null) {
      return res.status(400).json({
        ok: false,
        message: "Can't edit main category",
      });
    }

    let parentCategoryId;
    switch (true) {
      case mainCategory === "Jackets":
        parentCategoryId = 1;
        break;
      case mainCategory === "Tops":
        parentCategoryId = 2;
        break;
      case mainCategory === "Bottom":
        parentCategoryId = 3;
        break;
      case mainCategory === "Bags":
        parentCategoryId = 4;
        break;
      case mainCategory === "Accessories":
        parentCategoryId = 5;
        break;
      default:
        return res.status(400).json({
          ok: false,
          message: "Invalid mainCategory",
        });
    }

    name = name.charAt(0).toUpperCase() + name.slice(1);
    category.name = name;
    category.parentCategoryId = parentCategoryId;
    await category.save();

    return res.status(200).json({
      ok: true,
      message: "Category updated successfully",
      detail: category.name,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        ok: false,
        message: "Category not found",
      });
    }

    if (category.parentCategoryId === null) {
      return res.status(400).json({
        ok: false,
        message: "Can't delete main category",
      });
    }

    await category.destroy();

    return res.status(200).json({
      ok: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });

    if (categories.length === 0) {
      return res.status(200).json({
        ok: true,
        message: "Categories is empty",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Categories retrieved successfully",
      detail: categories,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

const getCategoryGender = async (categoryId, Category) => {
  const category = await Category.findByPk(categoryId);

  if (!category) {
    return null; // Category not found
  }

  // If the current category has a parent, recurse to its parent
  if (category.parentCategoryId) {
    return getCategoryGender(category.parentCategoryId, Category);
  }

  return category.name; // The top-level category name represents gender
};

exports.getCategorySubcategories = async (req, res) => {
  try {
    const { mainCategory } = req.query;

    if (!mainCategory) {
      return res.status(400).json({
        ok: false,
        message: "Main category is a required parameter.",
      });
    }

    // Find the main category ID
    const mainCategoryInstance = await Category.findOne({
      where: { name: mainCategory, parentCategoryId: null },
    });

    if (!mainCategoryInstance) {
      return res.status(404).json({
        ok: false,
        message: "Main category not found.",
      });
    }

    // Infer gender from the hierarchy
    const gender = await getCategoryGender(mainCategoryInstance.id, Category);

    // Find subcategories of the main category
    const subcategories = await Category.findAll({
      where: { parentCategoryId: mainCategoryInstance.id },
    });

    if (subcategories.length === 0) {
      return res.status(200).json({
        ok: true,
        message: "No subcategories found for the specified main category.",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Subcategories retrieved successfully",
      detail: { subcategories, gender },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

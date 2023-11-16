const { validationResult } = require("express-validator");
const { Category } = require("../models");
const { Op } = require("sequelize");

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
    const { minId = 1, maxId, page = 1, size = 10, parentCategoryId } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // If maxId is specified, add it to the where clause
    const whereClause = {
      id: {
        [Op.gte]: minId,
      },
    };

    if (maxId) {
      whereClause.id[Op.lte] = maxId;
    }

    // If parentCategoryId is specified, add it to the where clause
    if (parentCategoryId && parentCategoryId !== "undefined") {
      whereClause.parentCategoryId = parentCategoryId;
    }

    const categories = await Category.findAll({
      where: whereClause,
      order: [["name", "ASC"]],
      limit,
      offset,
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

exports.handleGetSubCategory = async (req, res) => {
  try {
    const { mainCategory } = req.query;

    // Find the main category by name
    const mainCategoryInstance = await Category.findOne({
      where: { name: mainCategory },
    });

    if (!mainCategoryInstance) {
      return res.status(404).json({
        ok: false,
        message: "Main category not found.",
      });
    }

    // Find subcategories of the specified main category
    const subcategories = await Category.findAll({
      where: { parentCategoryId: mainCategoryInstance.id },
    });

    return res.status(200).json({
      ok: true,
      message: "Subcategories retrieved successfully",
      detail: subcategories,
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

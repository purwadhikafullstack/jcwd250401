const { validationResult } = require("express-validator");
const { Category } = require("../models");

exports.createCategory = async (req, res) => {
  let { name, parentCategoryId } = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({
        ok: false,
        message: "Validation error",
        detail: errors.array(),
      });
    }

    const findCategory = await Category.findOne({ where: { name } });
    if (findCategory) {
      return res.status(400).json({
        ok: false,
        message: "Category already exists",
        detail: findCategory,
      });
    } else {
      name = name.charAt(0).toUpperCase() + name.slice(1);
      const newCategory = await Category.create({ name, parentCategoryId });

      return res.status(201).json({
        ok: true,
        message: "Category created successfully",
        detail: newCategory,
      });
    }
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
  let { name } = req.body;
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

    name = name.charAt(0).toUpperCase() + name.slice(1);
    category.name = name;
    await category.save();

    return res.status(200).json({
      ok: true,
      message: "Category updated successfully",
      detail: category,
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

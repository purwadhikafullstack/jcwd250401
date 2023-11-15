"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.belongsToMany(models.Product, {
        through: "ProductCategory",
        foreignKey: "categoryId",
      });
      Category.hasMany(models.ProductCategory, { foreignKey: "categoryId" });
      Category.belongsTo(models.Category, {
        foreignKey: "parentCategoryId",
        as: "parentCategory",
      });
      Category.hasMany(models.Category, {
        foreignKey: "parentCategoryId",
        as: "subcategories",
      });
    }
  }
  Category.init(
    {
      name: DataTypes.STRING,
      parentCategoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};

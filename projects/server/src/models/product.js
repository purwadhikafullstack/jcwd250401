"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.ProductImage, {
        foreignKey: "productId",
        as: "productImages",
      });
      Product.belongsToMany(models.Category, {
        through: models.ProductCategory,
        foreignKey: "productId",
        as: "Categories",
      });
      Product.hasMany(models.OrderItem, { foreignKey: "productId" });
      Product.belongsToMany(models.Wishlist, {
        through: models.WishlistProduct,
        foreignKey: "productId",
      });
      Product.belongsToMany(models.Cart, {
        through: models.CartItem,
        foreignKey: "productId",
      });
      Product.hasMany(models.Mutation, { foreignKey: "productId" });
      Product.hasMany(models.Journal, { foreignKey: "productId" });
    }
  }
  Product.init(
    {
      sku: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      weight: DataTypes.INTEGER,
      length: DataTypes.INTEGER,
      width: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
      material: DataTypes.STRING,
      lining: DataTypes.STRING,
      waterproofRating: DataTypes.STRING,
      viewCount: DataTypes.INTEGER,
      soldCount: DataTypes.INTEGER,
      isArchived: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};

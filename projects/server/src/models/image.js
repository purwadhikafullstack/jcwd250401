"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Image.belongsToMany(models.Product, {
        through: "ProductImage",
        foreignKey: "imageId",
      });
      Image.hasMany(models.ProductImage, { foreignKey: "imageId" });
    }
  }
  Image.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Image",
    }
  );
  return Image;
};

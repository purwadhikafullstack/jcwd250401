'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        ProductImage.belongsTo(models.Product, { foreignKey: 'productId' });
        ProductImage.belongsTo(models.Image, { foreignKey: 'imageId' });
    }
  }
  ProductImage.init({
    productId: DataTypes.INTEGER,
    imageId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductImage',
  });
  return ProductImage;
};
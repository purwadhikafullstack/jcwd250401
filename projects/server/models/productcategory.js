'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductCategory.init({
    product_id: DataTypes.NUMBER,
    category_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'ProductCategory',
  });
  return ProductCategory;
};
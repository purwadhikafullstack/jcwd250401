'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WishlistProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WishlistProduct.belongsTo(models.Wishlist, {foreignKey: 'wishlistId'})
      WishlistProduct.belongsTo(models.Product, {foreignKey: 'productId'})
    }
  }
  WishlistProduct.init({
    wishlistId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'WishlistProduct',
  });
  return WishlistProduct;
};
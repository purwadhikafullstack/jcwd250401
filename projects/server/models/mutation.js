'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mutation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Mutation.belongsTo(models.Product, { foreignKey: 'productId' });
        Mutation.belongsTo(models.Warehouse, { foreignKey: 'warehouseId' });
        Mutation.belongsTo(models.Admin, { foreignKey: 'adminId' });
    }
  }
  Mutation.init({
    productId: DataTypes.INTEGER,
    warehouseId: DataTypes.INTEGER,
    mutatioQuantity: DataTypes.INTEGER,
    mutationType: DataTypes.STRING,
    adminId: DataTypes.INTEGER,
    stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Mutation',
  });
  return Mutation;
};
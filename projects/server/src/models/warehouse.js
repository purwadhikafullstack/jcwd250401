'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Warehouse.belongsTo(models.WarehouseAddress, {  foreignKey: 'warehouseAddressId' });
      Warehouse.belongsTo(models.Admin, {  foreignKey: 'adminId' });
      
    }
  }
  Warehouse.init({
    location: DataTypes.STRING,
    name: DataTypes.STRING,
    warehouseAddressId: DataTypes.INTEGER,
    adminId: DataTypes.INTEGER,
    warehouseImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Warehouse',
  });
  return Warehouse;
};
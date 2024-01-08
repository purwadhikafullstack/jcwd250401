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
      Warehouse.hasMany(models.Journal, {  foreignKey: 'warehouseId' });
      Warehouse.hasMany(models.Mutation, {  foreignKey: 'warehouseId' });
    }
  }
  Warehouse.init({
    location: DataTypes.STRING,
    name: DataTypes.STRING,
    owner: DataTypes.STRING,
    warehouseAddressId: DataTypes.INTEGER,
    adminId: DataTypes.INTEGER,
    warehouseImage: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    OpenHour: DataTypes.TIME,
    CloseHour: DataTypes.TIME,
  }, {
    sequelize,
    modelName: 'Warehouse',
  });
  return Warehouse;
};
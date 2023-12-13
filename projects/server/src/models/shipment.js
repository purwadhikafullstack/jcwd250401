'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shipment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Shipment.belongsTo(models.Address, {  foreignKey: 'addressId' });
    }
  }
  Shipment.init({
    name: DataTypes.STRING,
    orderId: DataTypes.INTEGER,
    cost: DataTypes.INTEGER,
    addressId: DataTypes.INTEGER,
    shipmentStatus: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Shipment',
  });
  return Shipment;
};
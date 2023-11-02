'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WarehouseAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WarehouseAddress.init({
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    longitude: DataTypes.STRING,
    latitude: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'WarehouseAddress',
  });
  return WarehouseAddress;
};
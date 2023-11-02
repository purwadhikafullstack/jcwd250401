'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    totalPrice: DataTypes.NUMBER,
    paymentProof: DataTypes.BOOLEAN,
    user_id: DataTypes.NUMBER,
    shipment_id: DataTypes.NUMBER,
    status: DataTypes.STRING,
    warehouse_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
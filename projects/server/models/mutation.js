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
      // define association here
    }
  }
  Mutation.init({
    product_id: DataTypes.NUMBER,
    warehouse_id: DataTypes.NUMBER,
    mutation_quantity: DataTypes.NUMBER,
    mutatio_type: DataTypes.STRING,
    admin_id: DataTypes.NUMBER,
    stock: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Mutation',
  });
  return Mutation;
};
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mutation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Mutation.belongsTo(models.Product, { foreignKey: "productId" });
      Mutation.belongsTo(models.Warehouse, { foreignKey: "warehouseId" });
      Mutation.belongsTo(models.Admin, { foreignKey: "adminId" });
    }
  }
  Mutation.init(
    {
      productId: DataTypes.INTEGER,
      warehouseId: DataTypes.INTEGER,
      destinationWarehouseId: DataTypes.INTEGER,
      mutationQuantity: DataTypes.INTEGER,
      previousStock: DataTypes.INTEGER,
      mutationType: DataTypes.ENUM("add", "substract"),
      adminId: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      status: DataTypes.ENUM("pending", "approved", "processing", "success", "cancelled", "failed"),
      isManual: DataTypes.BOOLEAN,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Mutation",
    }
  );
  return Mutation;
};

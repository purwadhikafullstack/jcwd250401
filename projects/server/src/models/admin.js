"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Admin.hasOne(models.Warehouse, {
        foreignKey: "adminId",
      });
      Admin.hasMany(models.Journal, {
        foreignKey: "adminId",
      });
    }
  }
  Admin.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      photoProfile: DataTypes.STRING,
      uniqueCode: DataTypes.STRING,
      uniqueCodeCreatedAt: DataTypes.DATE,
      isWarehouseAdmin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Admin",
    }
  );
  return Admin;
};

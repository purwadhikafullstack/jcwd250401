"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      Address.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Address.init(
    {
      userId: DataTypes.INTEGER,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      street: DataTypes.STRING,
      city: DataTypes.STRING,
      cityId: DataTypes.INTEGER,
      district: DataTypes.STRING,
      subDistrict: DataTypes.STRING,
      province: DataTypes.STRING,
      provinceId: DataTypes.INTEGER,
      longitude: DataTypes.STRING,
      latitude: DataTypes.STRING,
      setAsDefault: DataTypes.BOOLEAN,
      phoneNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Address",
    }
  );
  return Address;
};

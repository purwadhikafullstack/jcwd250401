'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Order, { foreignKey: 'userId' });
      User.hasMany(models.Address, { foreignKey: 'userId', as: 'Addresses' });
      User.hasMany(models.Cart, {foreignKey: 'userId'}) 
      User.hasMany(models.Wishlist, {foreignKey: 'userId'})
    }
  }

  User.init({
    username: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    photoProfile: DataTypes.STRING,
    registBy: DataTypes.STRING,
    isVerify: DataTypes.BOOLEAN,
    verifyCode: DataTypes.STRING,
    uniqueCode: DataTypes.STRING,
    uniqueCodeCreatedAt: DataTypes.DATE,
    verifyCodeCreatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
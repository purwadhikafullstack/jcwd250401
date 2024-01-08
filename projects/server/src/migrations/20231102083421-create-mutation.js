"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Mutations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Products",
          },
          key: "id",
        },
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Warehouses",
          },
          key: "id",
        },
      },
      mutationQuantity: {
        type: Sequelize.INTEGER,
      },
      mutationType: {
        type: Sequelize.ENUM("add", "subtract"),
      },
      adminId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Admins",
          },
          key: "id",
        },
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Mutations");
  },
};

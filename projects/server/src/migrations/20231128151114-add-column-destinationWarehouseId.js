"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Mutations", "destinationWarehouseId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "warehouseId",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Mutations", "destinationWarehouseId");
  },
};

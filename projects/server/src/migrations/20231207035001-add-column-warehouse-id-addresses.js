"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("WarehouseAddresses", "cityId", {
      type: Sequelize.INTEGER,
      after: "city",
    });

    await queryInterface.addColumn("WarehouseAddresses", "provinceId", {
      type: Sequelize.INTEGER,
      after: "province",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("WarehouseAddresses", "cityId");
    await queryInterface.removeColumn("WarehouseAddresses", "provinceId");
  },
};
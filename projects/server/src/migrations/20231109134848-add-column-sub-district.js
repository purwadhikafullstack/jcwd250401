"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Addresses", "subDistrict", {
      type: Sequelize.STRING,
      allowNull: false,
      after: "district",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Addresses", "subDistrict");
  },
};

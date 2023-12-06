"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Addresses", "cityId", {
      type: Sequelize.INTEGER,
      after: "city",
    });

    await queryInterface.addColumn("Addresses", "provinceId", {
      type: Sequelize.INTEGER,
      after: "province",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Addresses", "cityId");
    await queryInterface.removeColumn("Addresses", "provinceId");
  },
};

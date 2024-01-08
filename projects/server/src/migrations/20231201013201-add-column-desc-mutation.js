"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Mutations", "description", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "isManual",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Mutations", "description");
  },
};

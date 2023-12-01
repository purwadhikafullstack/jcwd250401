"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Mutations", "status", {
      type: Sequelize.ENUM("pending", "approved", "processing", "success", "cancelled", "failed"),
      allowNull: true,
      after: "stock",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Mutations", "status");
  },
};

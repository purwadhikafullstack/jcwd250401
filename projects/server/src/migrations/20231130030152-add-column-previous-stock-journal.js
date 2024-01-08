'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Journals", "previousStock", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "mutationQuantity",
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Journals", "previousStock");
  }
};

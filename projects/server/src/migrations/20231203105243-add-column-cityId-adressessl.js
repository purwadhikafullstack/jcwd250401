'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Journals", "mutationId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "id",
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Journals", "mutationId");
  }
};

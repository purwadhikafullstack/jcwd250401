'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Mutations", "isManual", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      after: "status",
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Mutations", "isManual");
  }
};

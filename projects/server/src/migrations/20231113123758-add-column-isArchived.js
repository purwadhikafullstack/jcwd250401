'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "isArchived", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      after: "soldCount",
      defaultValue: false,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "isArchived");
  }
};

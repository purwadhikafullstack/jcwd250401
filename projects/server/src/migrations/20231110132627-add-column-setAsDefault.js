'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.addColumn("Addresses", "setAsDefault", {
          type: Sequelize.BOOLEAN,
          after: "latitude",
          defaultValue: false,
          allowNull: false
      })
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.removeColumn("Addresses", "setAsDefault")
  }
};

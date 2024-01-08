"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .addColumn(
        "Addresses", // your table name
        "firstName",
        {
          type: Sequelize.STRING,
          allowNull: false,
          after: "userId",
        }
      )
      .then(() => {
        return queryInterface.addColumn("Addresses", "lastName", {
          type: Sequelize.STRING,
          allowNull: false,
          after: "firstName",
        });
      });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "viewCount", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      after: "gender",
    });

    await queryInterface.addColumn("Products", "soldCount", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      after: "viewCount", // Adjust this based on your requirements
    });

    await queryInterface.sequelize.query("UPDATE Products SET viewCount = 0, soldCount = 0 WHERE viewCount IS NULL OR soldCount IS NULL");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "soldCount");
    await queryInterface.removeColumn("Products", "viewCount");
  },
};

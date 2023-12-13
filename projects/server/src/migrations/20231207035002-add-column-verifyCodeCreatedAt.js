"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "verifyCodeCreatedAt", {
      type: Sequelize.DATE,
      after: "verifyCode",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "verifyCodeCreatedAt");
  },
};

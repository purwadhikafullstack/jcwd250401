"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Orders", "paymentBy", {
      type: Sequelize.ENUM("MANDIRI", "BCA", "BNI"),
      after: "totalPrice",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Orders", "paymentBy");
  },
};



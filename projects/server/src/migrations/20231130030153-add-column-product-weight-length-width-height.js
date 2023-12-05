'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "weight", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "gender",
    });
    await queryInterface.addColumn("Products", "length", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "weight",
    });
    await queryInterface.addColumn("Products", "width", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "length",
    });
    await queryInterface.addColumn("Products", "height", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "width",
    });
    await queryInterface.addColumn("Products", "material", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "height",
    });
    await queryInterface.addColumn("Products", "lining", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "material",
    });
    await queryInterface.addColumn("Products", "waterproofRating", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "lining",
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "weight");
    await queryInterface.removeColumn("Products", "length");
    await queryInterface.removeColumn("Products", "width");
    await queryInterface.removeColumn("Products", "height");
    await queryInterface.removeColumn("Products", "material");
    await queryInterface.removeColumn("Products", "lining");
    await queryInterface.removeColumn("Products", "waterproofRating");
  }
};

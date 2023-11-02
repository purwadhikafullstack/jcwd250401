'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Mutations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.NUMBER
      },
      warehouse_id: {
        type: Sequelize.NUMBER
      },
      mutation_quantity: {
        type: Sequelize.NUMBER
      },
      mutatio_type: {
        type: Sequelize.STRING
      },
      admin_id: {
        type: Sequelize.NUMBER
      },
      stock: {
        type: Sequelize.NUMBER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Mutations');
  }
};
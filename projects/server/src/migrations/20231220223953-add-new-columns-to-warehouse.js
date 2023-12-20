'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('warehouses', 'phoneNumber', {
      type: Sequelize.STRING,
      allowNull: true,
      after: "warehouseImage"
    });
    await queryInterface.addColumn('warehouses', 'OpenHour', {
      type: Sequelize.TIME,
      allowNull: true,
      after: "phoneNumber"
    });
    await queryInterface.addColumn('warehouses', 'CloseHour', {
      type: Sequelize.TIME,
      allowNull: true,
      after: "OpenHour"
    });
    await queryInterface.addColumn('warehouses', 'owner', {
      type: Sequelize.STRING,
      allowNull: true,
      after: "name"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
      await queryInterface.removeColumn('warehouses', 'phoneNumber');
      await queryInterface.removeColumn('warehouses', 'OpenHour');
      await queryInterface.removeColumn('warehouses', 'CloseHour');
      await queryInterface.removeColumn('warehouses', 'owner');
  }
};

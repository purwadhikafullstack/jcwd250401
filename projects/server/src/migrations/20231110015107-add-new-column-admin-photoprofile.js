'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Admins', 'photoProfile', {
      type: Sequelize.STRING,
      allowNull: true, // Modify this as needed
      after: 'password', // Specify the column after which the new column should be added
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Admins', 'photoProfile');
  },
};
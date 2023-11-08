'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'registBy', {
      type: Sequelize.STRING,
      allowNull: true, // Modify this as needed
      after: 'photoProfile', // Specify the column after which the new column should be added
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'registBy');
  },
};
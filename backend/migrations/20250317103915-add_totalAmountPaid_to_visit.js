'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Visits", "totalAmountPaid", {
      type: Sequelize.FLOAT,  // Or Sequelize.INTEGER if needed
      allowNull: false,
      defaultValue: 0, // 
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Visits", "totalAmountPaid");
  }
};

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Visits', {
      visit_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Patients", // 👈 Use actual table name, not model name
          key: "patient_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      lastVisit: {
        type: Sequelize.DATE,
        allowNull: false, 
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      pendingAmount: {
        type: Sequelize.FLOAT,
        allowNull: true, 
        defaultValue: 0
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
    await queryInterface.dropTable('Visits');
  }
};
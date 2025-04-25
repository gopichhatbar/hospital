'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Medications', {
      medicine_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Patients", // Table name, NOT model name
          key: "patient_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",

      },
      visit_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Visits", // Table name, NOT model name
          key: "visit_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",

      },
      medicine: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      dose: {
        type: Sequelize.STRING,
        allowNull: false,

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
    await queryInterface.dropTable('Medications');
  }
};
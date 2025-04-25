'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Medication.belongsTo(models.Patient, {
        foreignKey: "patient_id",
        onDelete: "CASCADE"
      });

      Medication.belongsTo(models.Visit, {
        foreignKey: "visit_id",
        as: "Medications",
        onDelete: "CASCADE"
      });

      Medication.belongsTo(models.Medicine, {
        foreignKey: 'medicine_id',
        onDelete: 'CASCADE'
      });

    }
  }
  Medication.init({
    medicine_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Medicines',
        key: 'id_medicine'
      },
      onDelete: 'CASCADE'
    },

    patient_id: DataTypes.INTEGER,
    visit_id: DataTypes.INTEGER,
    medicine: DataTypes.STRING,
    dose: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Medication',
    tableName: 'Medications'
  });
  return Medication;
};
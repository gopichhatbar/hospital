'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Patient.hasMany(models.Visit, { foreignKey: "patient_id",as: "Visits", onDelete: "CASCADE" });
      Patient.hasMany(models.Medication, { foreignKey: "patient_id", onDelete: "CASCADE" });
      Patient.hasMany(models.Investigation, { foreignKey: "patient_id", onDelete: "CASCADE" });

    }
  }
  Patient.init({
    patient_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    number: DataTypes.STRING,
    totalAmountPaid: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Patient',
    tableName: 'Patients', // Ensure the correct table name

  });
  return Patient;
};
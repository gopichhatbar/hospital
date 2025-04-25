'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Visit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Visit.belongsTo(models.Patient, { foreignKey: "patient_id", onDelete: "CASCADE" });
      Visit.hasMany(models.Medication, { 
        foreignKey: "visit_id", 
        // as: "Medications", // ✅ This is the alias
        onDelete: "CASCADE" 
    });
    
      Visit.hasMany(models.Investigation, { foreignKey: "visit_id", onDelete: "CASCADE" });

    }
  }
  Visit.init({
    visit_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true, // ✅ Explicitly set as primary key
    },
    totalAmountPaid: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    patient_id: DataTypes.INTEGER,
    lastVisit: DataTypes.DATE,
    pendingAmount: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Visit',
    tableName: 'Visits',

  });
  return Visit;
};
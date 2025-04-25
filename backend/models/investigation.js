'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Investigation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Investigation.belongsTo(models.Patient, {  foreignKey: "patient_id",onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
      Investigation.belongsTo(models.Visit, { foreignKey: "visit_id", onDelete: "CASCADE" });

    }
  }
  Investigation.init({
    investigation_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true, // ✅ Explicitly set as primary key
    },
    visit_id:DataTypes.INTEGER,
    patient_id: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Investigation',
    tableName: 'Investigations'
  });
  return Investigation;
};
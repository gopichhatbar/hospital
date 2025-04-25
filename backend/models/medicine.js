'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medicine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Medicine.hasMany(models.Medication, {
        foreignKey: 'medicine_id',
        onDelete: 'CASCADE'
      });
      
    }
  }
  Medicine.init({
    id_medicine:
     {type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name_medicine: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // ✅ Ensure unique medicine names
    }
  }, {
    sequelize,
    modelName: 'Medicine',
    tableName: "Medicines"

  });
  return Medicine;
};
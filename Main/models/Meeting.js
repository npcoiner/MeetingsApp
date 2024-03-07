const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Meeting extends Model {}

Meeting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
  },
  title: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  description: {
      type: DataTypes.STRING,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  potential_times: {
      type: DataTypes.JSON,
      allowNull: false,
  },
  user_id: {
      type: DataTypes.INTEGER,
      references: {
          model: 'user',
          key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'meeting',
  }
);

module.exports = Meeting;

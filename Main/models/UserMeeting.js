const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class UserMeeting extends Model {}

UserMeeting.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    meeting_hash: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'meeting',
        key: 'hash',
      },
    },
    potential_times: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user_meeting',
  },
);

module.exports = UserMeeting;

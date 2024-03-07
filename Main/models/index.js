const User = require('./User');
const Meeting = require('./Meeting');

User.hasMany(Meeting, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Meeting.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = { User, Meeting };

const User = require('./User');
const Meeting = require('./Meeting');
const UserMeeting = require('./UserMeeting');

User.belongsToMany(Meeting, { through: UserMeeting, foreignKey: 'user_id', otherKey: 'meeting_hash' });
Meeting.belongsToMany(User, { through: UserMeeting, foreignKey: 'meeting_hash', otherKey: 'user_id' });

module.exports = {
  User,
  Meeting,
  UserMeeting,
};
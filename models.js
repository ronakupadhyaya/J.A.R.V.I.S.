var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI);

var userSchema = new Schema({
  slackId: {
    type: String,
    required: true
  },
  slackDmId: {
    type: String,
    required: true
  },
  google: {},
  pending: String,
  meeting: String
});

var reminderSchema = new Schema({
  subject: String,
  date: String,
  userId: String
});

var User = mongoose.model('User', userSchema);
var Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = {
  User: User,
  Reminder: Reminder
}

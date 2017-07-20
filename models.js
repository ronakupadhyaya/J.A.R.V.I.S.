import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI);

const userSchema = new Schema({
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

const reminderSchema = new Schema({
  subject: String,
  date: String,
  userId: String
});

const User = mongoose.model('User', userSchema);
const Reminder = mongoose.model('Reminder', reminderSchema);

// module.exports = {
//   User: User,
//   Reminder: Reminder
// };

export { User, Reminder };

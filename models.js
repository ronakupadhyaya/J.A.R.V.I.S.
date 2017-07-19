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
  google: {}
});

var User = mongoose.model('User', userSchema);

module.exports = {
  User: User
};

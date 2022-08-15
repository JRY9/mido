const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// const profilePictureSchema = new Schema({
//   url: String,
//   filename: String
// });

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  profilePicture: {
    url: String,
    filename: String
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('UserModel', UserSchema);

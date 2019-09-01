const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

// Schema Setup
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  isBanned: Boolean,
  isSuspended: Boolean,
  suspendedExpire: Date,
  suspendedReason: String,
  passwordChanged: Date,
  passwordChangedIP: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailVerificationToken: String,
  emailVerificationTokenExpire: Date,
  accountActivated: {
    type: Boolean,
    default: false
  },
  streamerMode: Boolean,
  isAdmin: Boolean,
  lastLog: Date,
  lastActivity: Date,
  createdIP: String,
}, {
    timestamps: true
  });

// Passport Mongoose addon.
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

module.exports = mongoose.model('User', userSchema);

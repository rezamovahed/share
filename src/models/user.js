const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Schema Setup
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  displayName: {
    type: String,
    unique: true,
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
  accountActvationToken: String,
  accountActvationExpire: Date,
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

module.exports = mongoose.model('User', userSchema)

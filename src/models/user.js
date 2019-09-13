const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userRoles = ['admin', 'user'];

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
  emailVerificationToken: String,
  emailVerificationTokenExpire: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  isBanned: Boolean,
  isSuspended: Boolean,
  suspendedExpire: Date,
  suspendedReason: String,
  passwordChanged: Date,
  passwordChangedIP: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  streamerMode: Boolean,
  role: {
    type: String,
    enum: userRoles,
    default: 'user'
  },
  lastLog: Date,
  lastActivity: Date,
}, {
    timestamps: true
  });

// Passport Mongoose addon.
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const { Schema } = mongoose;

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
  newEmail: String,
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

module.exports = mongoose.model('User', userSchema);

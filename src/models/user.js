const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Schema Setup
const userSchema = new mongoose.Schema({
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
  accountDeleteToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  accountActvationToken: String,
  accountActvationExpire: Date,
  accountActivated: {
    type: Boolean,
    default: false
  },
  isAdmin: String,
}, {
    timestamps: true
  });

// Passport Mongoose addon.
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

module.exports = mongoose.model("User", userSchema)

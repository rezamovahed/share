const mongoose = require('mongoose');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      unique: true,
      trim: true,
      lowercase: true,
      required: true
    },
    newEmail: String,
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
    passwordResetToken: String,
    passwordResetTokenExpire: Date,
    streamerMode: Boolean,
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    lastLogin: Date
  },
  {
    timestamps: true
  }
);

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(12, (err, salt) => {
    if (err) {
      return next(err);
    }
    // eslint-disable-next-line no-shadow
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

/**
 * Gravtar middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('email')) {
    return next();
  }

  user.avatar = gravatar.url(
    user.email,
    {
      s: '100',
      r: 'x',
      d: 'retro'
    },
    true
  );
  next();
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);

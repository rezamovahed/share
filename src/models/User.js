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
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: 'https://www.gravatar.com/avatar'
    },
    emailVerificationToken: String,
    emailVerificationTokenExpire: Date,
    emailVerified: {
      type: Boolean,
      default: false
    },
    newEmailVerificationToken: String,
    newEmailVerificationTokenExpire: Date,
    newEmail: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      trim: true,
      lowercase: true
    },
    isBanned: Boolean,
    isSuspended: Boolean,
    suspendedExpire: Date,
    suspendedReason: String,
    passwordChanged: Date,
    passwordChangedIP: String,
    passwordResetToken: String,
    passwordResetTokenExpire: Date,
    streamerMode: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'mod', 'user'],
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
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(12, (err, salt) => {
    if (err) {
      return next(err);
    }
    // eslint-disable-next-line no-shadow
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      this.password = hash;
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
userSchema.methods.verifyPassword = async function verifyPassword(
  candidatePassword
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  if (!isMatch) {
    return false;
  }
  return true;
};

module.exports = mongoose.model('User', userSchema);

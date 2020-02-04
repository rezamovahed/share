const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const slugify = require('slugify');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    slug: {
      type: String,
      lowercase: true,
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
    isVerified: {
      type: Boolean,
      default: false
    },
    lastLogin: Date,
    lastUpload: Date
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
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  if (!this.isModified('username')) {
    return next();
  }
  this.slug = slugify(this.username, {
    remove: /[*+~.()'"!:@]/g,
    lowercase: true
  });
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

userSchema.index(
  { username: 'text', email: 'text' },
  { weights: { username: 1, email: 2 } }
);

module.exports = mongoose.model('User', userSchema);

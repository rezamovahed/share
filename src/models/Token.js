const mongoose = require('mongoose');

const { Schema } = mongoose;
const tokenSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    hash: {
      type: String,
      required: true
    },
    lastUsed: Date,
    expireAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Token', tokenSchema);

const mongoose = require('mongoose');

const { Schema } = mongoose;
const tokenSchema = new mongoose.Schema({
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Token', tokenSchema);

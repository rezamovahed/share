const mongoose = require('mongoose');

const { Schema } = mongoose;

const linkSchema = new Schema(
  {
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    url: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    clicks: {
      type: Number,
      default: 0
    },
    limit: Number,
    tags: [{ type: String }],
    deleteKey: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Link', linkSchema);

const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const uploadSchema = new Schema({
  uploader: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileExtension: {
    type: String,
    required: true
  },
  uploaded: {
    type: String,
    enum: ['local'],
    default: 'local'
  },
  type: {
    type: String,
    enum: ['file', 'image', 'text'],
    default: 'file'
  },
  tags: [{ type: String }],
  deleteKey: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: moment()
  }
});

uploadSchema.index(
  { tags: 'text', fileName: 'text' },
  { weights: { tags: 1, fileName: 2 } }
);

module.exports = mongoose.model('Upload', uploadSchema);

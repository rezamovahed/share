const mongoose = require('mongoose');
const moment = require('moment');

const { Schema } = mongoose;

const uploadSchema = new Schema({
  uploader: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  fileName: {
    type: String,
    required: true
  },
  fileExtension: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['file', 'image', 'text'],
    default: 'file'
  },
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

module.exports = mongoose.model('Upload', uploadSchema);

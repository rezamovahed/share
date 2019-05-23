const mongoose = require('mongoose');

// Schema Setup
const uploadSchema = new mongoose.Schema({
  uploader: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  fileName: {
    type: String,
    required: true
  },
  fileExtension: {
    type: String,
    required: true
  },
  isImage: Boolean,
  key: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Upload", uploadSchema)

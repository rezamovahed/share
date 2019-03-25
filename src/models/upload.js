const mongoose = require('mongoose');

// Schema Setup
const uploadSchema = new mongoose.Schema({
  uploader: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  fileName: {
    type: String,
    required: true
  },
  fileHash: {
    type: String,
    required: true
  },
  isImage: {
    type: Boolean,
    default: false
  },
  isFile: {
    type: Boolean,
    default: false
  },
  isText: {
    type: Boolean,
    default: false
  },

  size: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Upload", uploadSchema)

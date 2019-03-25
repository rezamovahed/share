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
    unique: true,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  }
}, {
    timestamps: true
  });


module.exports = mongoose.model("Upload", uploadSchema)

const mongoose = require('mongoose');

// Schema Setup
const keySchema = new mongoose.Schema({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  hash: {
    type: String,
    required: true
  },
}, {
    timestamps: true
  });


module.exports = mongoose.model('Key', keySchema);

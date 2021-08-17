const mongoose = require('mongoose');

const { Schema } = mongoose;

const QueueSchema = new Schema({
  type: {
    type: String,
    enum: ['upload', 'link', 'email'],
    required: true
  },
  action: {
    type: String,
    enum: ['delete', 'add', 'email'],
    required: true
  },
  emailTemplete: {
    type: String,
    required: true
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  desc: {
    type: String,
    required: true
  },
  runAt: {
    type: Date
  }
});

module.exports = mongoose.model('Queue', QueueSchema);

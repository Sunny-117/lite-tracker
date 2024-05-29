const mongoose = require('mongoose');

const apiLog = new mongoose.Schema({
  appId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  subType: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: false,
  },
  startTime: {
    type: Number,
    required: false,
  },
  endTime: {
    type: Number,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  method: {
    type: String,
    required: false,
  },
  success: {
    type: String,
    required: false,
  },

  createTime: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: String,
    required: true,
  },
  ua: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('api', apiLog);
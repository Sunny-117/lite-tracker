const mongoose = require("mongoose");

const userActionSchema = new mongoose.Schema({
  appId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: false,
  },
  tagName: {
    type: String,
    required: false,
  },
  value: {
    type: String,
    required: false,
  },
  timeStamp: {
    type: String,
    required: false,
  },
  paths: {
    type: String,
    required: false,
  },
  x: {
    type: Number,
    required: false,
  },
  y: {
    type: Number,
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
  },
});

module.exports = mongoose.model("UserAction", userActionSchema);

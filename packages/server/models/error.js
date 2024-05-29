const mongoose = require("mongoose");

const errorLogSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  appId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  errorType: {
    type: String,
    required: false,
  },
  errMsg: {
    type: String,
    default: "",
  },
  stack: {
    type: String,
    default: "",
  },
  filename: {
    type: String,
    default: "",
  },
  functionName: {
    type: String,
    default: "",
  },
  tagName: {
    type: String,
    default: "",
  },
  colno: {
    type: Number,
    required: false,
  },
  lineno: {
    type: Number,
    required: false,
  },
  currentPage: {
    type: String,
    required: false,
  },
  createTime: {
    type: Number,
    required: true,
  },
  ua: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("errorlog", errorLogSchema);

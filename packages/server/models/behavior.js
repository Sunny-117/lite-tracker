const mongoose = require("mongoose");

const behaviorSchema = new mongoose.Schema({
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
  referrer: {
    type: String,
    required: false,
  },
  effectiveType: {
    type: String,
    required: false,
  },
  rtt: {
    type: Number,
    required: false,
  },
  from: {
    type: String,
    required: false,
  },
  to: {
    type: String,
    required: false,
  },
  params: {
    type: Object,
    required: false,
  },
  query: {
    type: Object,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  stayTime: {
    type: Number,
    required: false,
  },
  createTime: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: String,
    required: false,
  },
  ua: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("behavior", behaviorSchema);

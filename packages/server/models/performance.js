const mongoose = require("mongoose");

const performanceLogSchema = new mongoose.Schema({
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
  name: {
    type: String,
    default: "",
  },
  value: {
    type: Number,
    required: false,
  },
  rating: {
    type: String,
    default: "good",
  },
  delta: {
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

module.exports = mongoose.model("performancelog", performanceLogSchema);

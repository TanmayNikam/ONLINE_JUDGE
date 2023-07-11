const mongoose = require("mongoose");

const tcSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: String,
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
  },
});

module.exports = mongoose.model("TestCase", tcSchema);

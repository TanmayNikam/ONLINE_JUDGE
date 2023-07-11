const mongoose = require("mongoose");

const problemScehma = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ipFormat: {
    type: String,
  },
  opFormat: {
    type: String,
  },
  constraints:{
    type:String,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy",
  },
  timelimit: {
    type: Number,
    default: 1000,
  },
});

module.exports = mongoose.model("Problem", problemScehma);

const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["c", "cpp", "py", "java", "js"],
      required: true,
    },
    verdict: {
      type: String,
      enum: [
        "Accepted",
        "Pending",
        "Compile Error",
        "Runtime Error",
        "Time Limit Exceeded",
        "Wrong Answer",
      ],
      default: "Pending",
    },
    runtime: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);

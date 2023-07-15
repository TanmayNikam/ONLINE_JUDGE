const Queue = require("bull");
const path = require("path");

const TestCase = require("../../models/testCases");
const Submission = require("../../models/submissions.js");

const { execCodeAgainstTestcases, deleteFile } = require("./codeExecute.js");

const WORKERS_NUMBER = 5;
const QUEUE_CONFIG = {
  defaultJobOptions: {
    removeOnComplete: true,
    attempts: 3,
    redis: { host: "localhost", port: 6379 },
  },
};

const queryQueue = new Queue("query-queue", QUEUE_CONFIG);

queryQueue.process(WORKERS_NUMBER, async (data) => {
  let submission;
  try {
    const { filepath, problemId, submissionId } = data.data;
    submission = await Submission.findOne({ _id: submissionId }).populate(
      "problem"
    );
    const testCases = await TestCase.find({ problem: problemId });

    const verdict = await execCodeAgainstTestcases(
      filepath,
      testCases,
      submission.language
    );
    let verdictMessage;
    if (verdict.time > submission.problem.timelimit)
      verdictMessage = "Time Limit Exceeded";
    else verdictMessage = "Accepted";

    await Submission.findByIdAndUpdate(submissionId, {
      verdict: verdictMessage,
      runtime: verdict.time,
    });
  } catch (error) {
    let verdictMessage = "pending";
    switch (error.msg) {
      case "Wrong Answer":
        {
          verdictMessage = "Wrong Answer";
        }
        break;
      case "on compile error":
        {
          verdictMessage = "Compile Error";
        }
        break;
      default:
        {
          verdictMessage = "Runtime Error";
        }
        break;
    }
    await Submission.findByIdAndUpdate(submission._id, {
      verdict: verdictMessage,
    });
  } finally {
    const filename = path.basename(data.data.filepath);
    deleteFile(filename);
  }
});

const addQueryqueue = async (data) => {
  await queryQueue.add(data);
};

module.exports = { addQueryqueue };

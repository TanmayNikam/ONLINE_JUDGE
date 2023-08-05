const Submissions = require("../models/submissions");
const TestCase = require("../models/testCases");
const { getTestCasesByProblem } = require("./testCases");
const {
  createFile,
  execCodeAgainstTestcases,
} = require("./codeExecutor/codeExecute_noDocker");
// const {
//   createFile,
//   execCodeAgainstTestcases,
// } = require("./codeExecutor/codeExecute");

const { addQueryqueue } = require("./codeExecutor/queryQueue");

exports.getSubmissions = async (req, res) => {
  try {
    const { problemId } = req.params;
    let filter = { problem: problemId };
    const allSubmissions = await Submissions.find(filter)
      .select("-code")
      .sort("-createdAt")
      .populate("user", "username _id")
      .populate("problem", "title _id");

    res.status(200).json({
      submissions: allSubmissions,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.getSubmissionById = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await Submissions.findOne({ _id: submissionId });
    res.status(200).json({
      submission,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.getSubmissionCode = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const code = await Submissions.findOne({ _id: submissionId }).select(
      "code"
    );
    res.status(200).json({
      code,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.getSubmissionsOfUser = async (req, res) => {
  try {
    const { problemId } = req.params;
    const user = req.user._id;
    let filter = { problem: problemId, ...req.body, user };
    const allSubmissions = await Submissions.find(filter)
      .select("-code")
      .sort("-createdAt")
      .populate("user", "username _id")
      .populate("problem", "title _id");

    res.status(200).json({
      submissions: allSubmissions,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.addSubmission = async (req, res) => {
  try {
    const problem = req.params.problemId;
    const user = req.user._id;
    const { code, language } = req.body;

    // let inputText = text.replace(/\r?\n/g, "\n");
    // let input = req.body.input.replace;

    const newSubmission = await Submissions.create({
      user,
      problem,
      code,
      language,
    });

    const { filepath, filename } = createFile(language, code);
    // console.log("filepath: ", filepath);

    const queryData = {
      filepath,
      problemId: problem,
      submissionId: newSubmission._id,
    };

    await addQueryqueue(queryData);

    res.status(201).json({
      message: "Submisson added successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

// Check submissions against testCases
// const validateSubmission = async (code, language, testCases) => {
//   try {
//     const { filepath, filename } = createFile(language, code);
//     addQueryqueue({ filepath, testcases });
//     const verdict = await execCodeAgainstTestcases(
//       filepath,
//       testCases,
//       language
//     );
//     return [verdict, true];
//   } catch (error) {
//     console.log(error);
//     return [error, false];
//   }
// };

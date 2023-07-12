const Submissions = require("../models/submissions");
const TestCase = require("../models/testCases");
const { getTestCasesByProblem } = require("./testCases");
const {
  createFile,
  execCodeAgainstTestcases,
} = require("./codeExecutor/codeExecute");

exports.getSubmissions = async (req, res) => {
  try {
    const filter = { ...req.body };
    const { page } = req.query;

    const limit = 10,
      offset = limit * (page - 1);

    const allSubmissions = await Submissions.find(filter)
      .skip(offset)
      .limit(limit)
      .select("-code")
      .populate("user", "username _id")
      .populate("problem", "title _id");

    res.status(200).json({
      allSubmissions,
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
    const user = req.user._id;
    const filter = { ...req.body, user };
    const { page } = req.query;
    const limit = 10,
      offset = limit * (page - 1);
    const allSubmissions = await Submissions.find(filter)
      .skip(offset)
      .limit(limit)
      .select("-code")
      .populate("user", "username _id")
      .populate("problem", "title _id");

    res.status(200).json({
      allSubmissions,
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
    const testCases = await TestCase.find({ problem });

    const verdict = await validateSubmission(code, language, testCases);
    console.log(verdict);

    const newSubmisson = await Submissions.create({
      user,
      problem,
      code,
      language,
    });

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
const validateSubmission = async (code, language, testCases) => {
  try {
    const { filepath, filename } = createFile(language, code);
    const verdict = await execCodeAgainstTestcases(
      filepath,
      testCases,
      language
    );
    return [verdict, true];
  } catch (error) {
    console.log(error);
    return [error, false];
  }
};

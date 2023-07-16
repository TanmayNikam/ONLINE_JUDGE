const TestCase = require("../models/testCases");

exports.addTestCase = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { input, output } = req.body;
    const newTestCase = await TestCase.create({
      input,
      output,
      problem: problemId,
    });
    res.status(201).json({
      message: "Test Case Added",
      testCase: newTestCase,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.editTestCase = async (req, res) => {
  try {
    const { testCaseId } = req.params;
    const updatedTestCase = await TestCase.findOneAndUpdate(
      {
        _id: testCaseId,
      },
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Test Case updated",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.getTestCaseById = async (req, res) => {
  try {
    const { testCaseId } = req.params;
    const testCase = await TestCase.findOne({ _id: testCaseId });
    res.status(200).json({
      testCase,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.deleteTestCase = async (req, res) => {
  try {
    const { testCaseId } = req.params;
    await TestCase.findOneAndDelete({ _id: testCaseId });
    res.status(200).json({
      message: "Test Case Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.getTestCasesByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const testCases = await TestCase.find({ problem: problemId });
    res.status(200).json({
      testCases,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

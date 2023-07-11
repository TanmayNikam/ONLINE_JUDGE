const Problem = require("../models/problems");

exports.getProblems = async (req, res) => {
  try {
    const { page } = req.query;
    const limit = 10,
      offset = limit * (page - 1);
    const problems = await Problem.find({})
      .skip(offset)
      .limit(limit)
      .select("title difficulty _id");

    res.status(200).json({
      problems,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const { problemId } = req.params;
    const problem = await Problem.findOne({ _id: problemId });
    res.status(200).json({
      problem,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.addProblem = async (req, res) => {
  try {
    const { title, description, ipFormat, opFormat, difficulty, timelimit } =
      req.body;
    // let inputText = text.replace(/\r?\n/g, "\n");
    // let input = req.body.input.replace;

    const newProblem = await Problem.create({
      title,
      description,
      ipFormat,
      opFormat,
      difficulty,
      timelimit,
    });
    res.status(201).json({
      message: "Problem added successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.editProblem = async (req, res) => {
  try {
    const updatedProblem = await Problem.findOneAndUpdate(
      {
        _id: req.params.problemId,
      },
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Problem updated",
      problem: updatedProblem,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    await Problem.findOneAndDelete({ _id: problemId });
    res.status(200).json({
      message: "Problem Deleted Successfully",
      sucess: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

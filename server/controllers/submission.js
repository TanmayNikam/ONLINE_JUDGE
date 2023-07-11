const Submissions = require("../models/submissions");

exports.getSubmissions = async (req, res) => {
  try {
    const { page } = req.query;
    const filter={...req.body};
    const limit = 10,
      offset = limit * (page - 1);
    const allSubmissions = await Submissions.find(filter)
      .skip(offset)
      .limit(limit)
      .select("problem language verdict timestamp");

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

exports.getSubmissionsOfUser = async (req, res) => {

    try {
      const user = req.user._id;
      const filter={...req.body,user};
      const { page } = req.query;
      const limit = 10,
        offset = limit * (page - 1);
      const allSubmissions = await Submissions.find(filter)
        .skip(offset)
        .limit(limit)
        .select("problem language verdict timestamp");
  
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
    const {  code, language} = req.body;

    // let inputText = text.replace(/\r?\n/g, "\n");
    // let input = req.body.input.replace;

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



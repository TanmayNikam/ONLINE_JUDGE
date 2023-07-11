const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");
const submissionsController = require("../controllers/submission");

// get submissions
router.get("/", submissionsController.getSubmissions);
router.get("/user", 
userController.isAuthenticated,
submissionsController.getSubmissionsOfUser);
router.get("/:submissionId", submissionsController.getSubmissionById);

//add Submissions
router.post(
  "/:problemId",
  userController.isAuthenticated,
  submissionsController.addSubmission
);


module.exports = router;

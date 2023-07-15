const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");
const submissionsController = require("../controllers/submission");

// get submissions
router.get("/:problemId", submissionsController.getSubmissions);
router.get(
  "/user/:problemId",
  userController.isAuthenticated,
  submissionsController.getSubmissionsOfUser
);

router.get("/:submissionId", submissionsController.getSubmissionById);
router.get("/code/:submissionId", submissionsController.getSubmissionCode);

//add Submissions
router.post(
  "/:problemId",
  userController.isAuthenticated,
  submissionsController.addSubmission
);

module.exports = router;

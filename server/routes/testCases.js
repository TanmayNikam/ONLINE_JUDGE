const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");
const testCaseController = require("../controllers/testCases");

// get testcase
router.get("/problem/:problemId", testCaseController.getTestCasesByProblem);
router.get("/:testCaseId", testCaseController.getTestCaseById);

// CRUD problems
router.post(
  "/:problemId",
  userController.isAuthenticated,
  userController.isAdmin,
  testCaseController.addTestCase
);

router.patch(
  "/:testCaseId",
  userController.isAuthenticated,
  userController.isAdmin,
  testCaseController.editTestCase
);

router.delete(
  "/:testCaseId",
  userController.isAuthenticated,
  userController.isAdmin,
  testCaseController.deleteTestCase
);

module.exports = router;

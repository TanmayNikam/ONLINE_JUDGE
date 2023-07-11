const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");
const problemsController = require("../controllers/problems");

// get problems
router.get("/", problemsController.getProblems);
router.get("/:problemId", problemsController.getProblemById);

// CRUD problems
router.post(
  "/",
  userController.isAuthenticated,
  userController.isAdmin,
  problemsController.addProblem
);

router.patch(
  "/:problemId",
  userController.isAuthenticated,
  userController.isAdmin,
  problemsController.editProblem
);

router.delete(
  "/:problemId",
  userController.isAuthenticated,
  userController.isAdmin,
  problemsController.deleteProblem
);

module.exports = router;

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
// const dotenv = require("dotenv");
const cors = require("cors");

const userRouter = require("./routes/user");
const problemsRouter = require("./routes/problems");
const testCaseRouter = require("./routes/testCases");
const submissionRouter = require("./routes/submission");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/problems", problemsRouter);
app.use("/api/testCases", testCaseRouter);
app.use("/api/submissions", submissionRouter);

module.exports = app;

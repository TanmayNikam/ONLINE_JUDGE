require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
// const dotenv = require("dotenv");
const cors = require("cors");

const userRouter = require("./routes/user");

const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

app.use("/api/user", userRouter);

module.exports = app;

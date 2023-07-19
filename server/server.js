const app = require("./app");
const express = require("express");
const path = require("path");
const DBConnection = require("./dbConfig");
const {
  initAllDockerContainers,
} = require("./controllers/codeExecutor/codeExecute");

DBConnection();
initAllDockerContainers(); //init all docker containers for languages

// if (process.env.NODE_ENV === "production") {
app.use("/", express.static(path.join(__dirname, "./build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./build/index.html"));
});
// }

app.listen(process.env.PORT || 8000, (req, res) => {
  console.log(`server started running on port ${process.env.PORT}`);
});

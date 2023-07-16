const app = require("./app");
const DBConnection = require("./dbConfig");
const {
  initAllDockerContainers,
} = require("./controllers/codeExecutor/codeExecute");

DBConnection();
// initAllDockerContainers(); //init all docker containers for languages

app.listen(process.env.PORT || 8000, (req, res) => {
  console.log(`server started running on port ${process.env.PORT}`);
});

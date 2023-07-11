const app = require("./app");
const DBConnection = require("./dbConfig")


DBConnection();

app.listen(process.env.PORT || 8000, (req, res) => {
  console.log(`server started running on port ${process.env.PORT}`);
});

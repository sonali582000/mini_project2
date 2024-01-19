const express = require("express");
const app = express();

require("./config")(app);
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

require("./error-handling")(app);
module.exports = app;

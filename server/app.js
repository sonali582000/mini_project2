const express = require("express");
const app = express();

require("./config")(app);
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});
const indexRoutes = require("./routes/index.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/api", indexRoutes);
app.use("/auth", authRoutes);

require("./error-handling")(app);
module.exports = app;

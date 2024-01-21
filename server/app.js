const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const Port = process.env.PORT;

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error-handling");

const allRoutes = require("./routes");
app.use(allRoutes);

const docsRoute = require("./routes/docs.routes");
app.use("/docs", docsRoute);

const studentRoute = require("./routes/student.routes");
app.use("/api", studentRoute);

const cohortRoute = require("./routes/cohort.routes");
app.use("/api", cohortRoute);

const authRoute = require("./routes/auth.routes");
app.use("/auth", authRoute);

app.use(errorHandler);
app.use(notFoundHandler);

module.exports = app;

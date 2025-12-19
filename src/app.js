const path = require("path");
const express = require("express");
const morgan = require("morgan");
const router = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.use(router);
app.use(notFound);
app.use(errorHandler);

module.exports = app;

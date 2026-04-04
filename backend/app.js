var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
let mongoose = require("mongoose");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

app.get("/", function (req, res) {
  res.sendFile(path.join(frontendPath, "index.html"));
});

mongoose.connect("mongodb://localhost:27017/NNPTUD-C2").catch((err) => {
  console.log("MongoDB connection error (will retry):", err.message);
});
mongoose.connection.on("connected", () => {
  console.log("✓ MongoDB connected");
});
mongoose.connection.on("error", (err) => {
  console.log("MongoDB error:", err.message);
});

app.use("/api/v1/", require("./routes/index"));
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/roles", require("./routes/roles"));
app.use("/api/v1/products", require("./routes/products"));
app.use("/api/v1/categories", require("./routes/categories"));
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/inventories", require("./routes/inventories"));
app.use("/api/v1/carts", require("./routes/carts"));
app.use("/api/v1/upload", require("./routes/upload"));
app.use("/api/v1/sizes", require("./routes/sizes"));
app.use("/api/v1/colors", require("./routes/colors"));
app.use("/api/v1/materials", require("./routes/materials"));
app.use("/api/v1/reviews", require("./routes/reviews"));
app.use("/api/v1/payments", require("./routes/payments"));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;

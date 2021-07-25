// const path = require("path");
const express = require("express");
// const catchError = require("./catchError");
const AppError = require("./errors");
const globalErrorHandler = require("./errorController");

const userRouter = require("./userRouter");

const app = express();

app.use(express.json({ limit: "10kb" }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

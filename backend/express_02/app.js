// var createError = require('http-errors');
import createError from "http-errors";
// var express = require('express');
import express from "express";
// var path = require('path');
// var cookieParser = require('cookie-parser');
import cookieParser from "cookie-parser";
// var logger = require('morgan');
import logger from "morgan";
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";

var app = express();

// view engine setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);

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
  res.render("error");
});

export default app;

const User = require("./userModel");
const catchError = require("./catchError");
const AppError = require("./errors");
const jwt = require("jsonwebtoken");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.createUser = catchError(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.cookie("jwt", token);

  res.status(201).json({
    status: "success",
    token,
    data: newUser,
  });

  next();
});

exports.getAllUsers = catchError(async (req, res, next) => {
  const users = await User.find();

  if (!users) {
    return next(new AppError(`No users signuped yet`, 404));
  }

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getOneUser = catchError(async (req, res, next) => {
  const user = await User.findOne(req.params.id);

  if (!user) {
    return next(new AppError("No user with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteUser = catchError(async (req, res, next) => {
  const doc = await User.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError(`No document found with that ID`, 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

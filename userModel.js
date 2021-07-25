const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please write your name"],
    maxlength: [20, "A user must have less or equal 20 charachters!"],
    minlength: [3, "A user must have more or equal 3 charachters!"],
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    minlength: [8, "A user must have more or equal 8 charachters!"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confitm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are the same!!!",
    },
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model("User", userSchema);
module.exports = User;

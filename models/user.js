const mongoose = require('mongoose');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  firstname: String,
  lastname: String,
  dateOfBirth: Date,
  country: String,
  resetToken: String,
  resetTokenExpiration: String,
  cart: {
    items: [{
      productId: String,
      quantity: Number
    }]
  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model("User", userSchema);

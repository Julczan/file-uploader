const bcrypt = require("bcryptjs");
const { prisma } = require("../lib/prisma");
const { createUser } = require("../config/queries");
const { generatePassword } = require("../lib/passwordUtils");

exports.signUpFormPost = async (req, res, next) => {
  const hashedPassword = await generatePassword(req.body.password);

  await createUser(req.body.username, req.body.email, hashedPassword);

  res.redirect("/");
};

exports.signUpFormGet = (req, res) => {
  res.render("signUpForm");
};

exports.loginFormGet = (req, res, next) => {
  res.render("loginForm", { messages: req.session.messages });
  next();
};

exports.clearFailMessages = (req, res) => {
  if (req.session.messages) {
    req.session.messages = [];
  }
};

exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

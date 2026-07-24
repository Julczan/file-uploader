const bcrypt = require("bcryptjs");
const { prisma } = require("../lib/prisma");
const {
  createUser,
  findUserByUsername,
  findUserByEmail,
} = require("../config/queries");
const { generatePassword } = require("../lib/passwordUtils");
const { body, validationResult, matchedData } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 15 characters!";

const validateSignUp = [
  body("username")
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage(`Username ${lengthErr}`)
    .custom(async (value) => {
      const user = await findUserByUsername(value);
      if (user) {
        throw new Error("Username already exists!");
      }
    }),
  body("email")
    .isEmail()
    .withMessage("Email must be a valid email!")
    .custom(async (value) => {
      const user = await findUserByEmail(value);
      if (user) {
        throw new Error("Email already exists!");
      }
    }),
  ,
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must have at least 5 characters!"),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords do not match!"),
];

exports.signUpFormPost = [
  validateSignUp,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signUpForm", {
        errors: errors.array(),
      });
    }
    const { username, email, password } = matchedData(req);
    const hashedPassword = await generatePassword(password);

    await createUser(username, email, hashedPassword);

    res.redirect("/log-in");
  },
];

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

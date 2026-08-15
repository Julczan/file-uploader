const { Router } = require("express");
const passport = require("passport");
const { indexPageGet } = require("../controllers/indexController");
const {
  signUpFormGet,
  signUpFormPost,
  logOut,
  loginFormGet,
  clearFailMessages,
} = require("../controllers/passportController");
const { authenticateToken } = require("../config/passport-jwt");

const indexRouter = Router();

indexRouter.get("/log-in", loginFormGet, clearFailMessages);
indexRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureMessage: true,
  }),
);
indexRouter.get("/log-out", logOut);
indexRouter.get("/", indexPageGet);
indexRouter.get("/sign-up", signUpFormGet);
indexRouter.post("/sign-up", signUpFormPost);
indexRouter.get("/share/:token", authenticateToken);

module.exports = indexRouter;

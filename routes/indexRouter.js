const { Router } = require("express");
const passport = require("passport");
const { indexPageGet } = require("../controllers/indexController");
const {
  signUpFormGet,
  signUpFormPost,
  logOut,
} = require("../controllers/passportController");

const indexRouter = Router();

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

module.exports = indexRouter;

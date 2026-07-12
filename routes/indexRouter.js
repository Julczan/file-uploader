const { Router } = require("express");
const { indexPageGet } = require("../controllers/indexController");
const {
  signUpFormGet,
  signUpFormPost,
} = require("../controllers/passportController");

const indexRouter = Router();

indexRouter.get("/", indexPageGet);
indexRouter.get("/sign-up", signUpFormGet);
indexRouter.post("/sign-up", signUpFormPost);

module.exports = indexRouter;

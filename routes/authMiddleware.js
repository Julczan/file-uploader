exports.isAuth = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render("loginForm", {
      messages: ["You are not authenticated. Please log in."],
    });
  }
};

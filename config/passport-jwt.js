const jwt = require("jsonwebtoken");
const passport = require("passport");
var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    console.log(jwt_payload);
  }),
);

exports.signToken = async (req, res, next) => {
  const payload = { name: "folderName" };
  const secret = process.env.JWT_SECRET;

  const token = jwt.sign(
    {
      data: payload,
    },
    secret,
    { expiresIn: "1h" },
  );

  next();
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    next();
  });
};

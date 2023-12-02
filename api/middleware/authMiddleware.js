const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  const validOrigin = req.headers?.referer.startsWith(
    process.env.CLIENT_URI_DEV
  );
  if (!validOrigin) {
    res.status(403).json({ err: "invalid origin" });
    return;
  }
  const checkingUserToken = req.route.path === "/api/checkToken";

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.status(400).json({ err: "invalid token" });
      } else if (checkingUserToken) {
        res.status(201).json({ valid: true });
      } else {
        next();
      }
    });
  } else {
    res.status(400).json({ err: "token expired!" });
  }
};

const requireAuth = (req, res, next) => {
  const tempToken = req.cookies.jwtTemp;
  const validOrigin = req.headers?.referer.startsWith(
    process.env.CLIENT_URI_DEV
  );
  if (!validOrigin) {
    res.status(403).json({ err: "invalid origin" });
    return;
  }

  if (tempToken) {
    jwt.verify(tempToken, process.env.TEMP_KEY, async (err, decodedToken) => {
      if (err) {
        res.status(400).json({ err: "invalid token" });
      } else {
        next();
      }
    });
  } else {
    res.status(400).json({ err: "no token" });
  }
};

module.exports = { checkUser, requireAuth };

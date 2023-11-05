const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.status(400).json({ err: "invalid token" });
        next();
      } else {
        res.status(200).json({ valid: true });
        next();
      }
    });
  } else {
    res.status(400).json({ err: "no token" });
    next();
  }
};

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
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

const requireAuthSeller = (req, res, next) => {
  // need to keep in mind we also need img auth while creating.
  // do seller auth
  // will be using middleware, new db model and routes/controllers
  // as well as a different type of JWT (diffrent server secret).
  // make jwt if info is valid(number, company name etc...)
  // modify checkuser to accept both types of tokens.
  // change UI for seller.
  // try to isolate this to prevent bugs.
};

module.exports = { checkUser, requireAuth };

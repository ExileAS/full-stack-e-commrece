const { userModel } = require("../models/userModel");
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
        const user = await userModel.findById(decodedToken.id);
        res.status(200).json({ user: user.email });
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
        res.status(200).json({ user: decodedToken.id });
        next();
      }
    });
  } else {
    res.status(400).json({ err: "no token" });
  }
};

module.exports = { checkUser, requireAuth };

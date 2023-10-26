const { userModel } = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.json().then((json) => Promise.reject(json));
        next();
      } else {
        const user = await userModel.findById(decodedToken.id);
        res.status(200).json({ user: user.email });
        next();
      }
    });
  } else {
    res.json().then((json) => Promise.reject(json));
    next();
  }
};

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.json().then((json) => Promise.reject(json));
      } else {
        res.status(200).json({ user: decodedToken.id });
        next();
      }
    });
  } else {
    res.json().then((json) => Promise.reject(json));
  }
};

module.exports = { checkUser, requireAuth };

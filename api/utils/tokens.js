const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: 60 * 60 * 24 * 2,
  });
};

const createTempToken = (id) => {
  return jwt.sign({ id }, process.env.TEMP_KEY, {
    expiresIn: 60 * 60 * 2,
  });
};

module.exports = { createToken, createTempToken };

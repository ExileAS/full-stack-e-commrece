const jwt = require("jsonwebtoken");

const createTempToken = (id) => {
  const token = jwt.sign({ id }, process.env.TEMP_KEY, {
    expiresIn: 60 * 60 * 2,
  });
  return {
    token,
    name: "jwtTemp",
    options: {
      maxAge: 1000 * 60 * 60 * 2,
      httpOnly: true,
    },
  };
};

const createToken = (id) => {
  const token = jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: 60 * 60 * 24 * 3,
  });
  return {
    token,
    name: "jwt",
    options: {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    },
  };
};

module.exports = { createToken, createTempToken };

const jwt = require("jsonwebtoken");
require("dotenv").config();
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
      sameSite: "None",
      secure: true,
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
      sameSite: "None",
      secure: true,
    },
  };
};

const createResetToken = (id) => {
  const token = jwt.sign({ id }, process.env.RESET_KEY, {
    expiresIn: 60 * 60,
  });
  return {
    token,
    name: "jwtReset",
    options: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    },
  };
};

const createSellerToken = (id) => {
  const token = jwt.sign({ id }, process.env.SELLER_KEY, {
    expiresIn: 60 * 60 * 24 * 3,
  });
  return {
    token,
    name: "jwtSeller",
    options: {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    },
  };
};

module.exports = {
  createToken,
  createTempToken,
  createResetToken,
  createSellerToken,
};

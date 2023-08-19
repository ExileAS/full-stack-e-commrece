const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      "extremely secret secret of all secrets 777",
      async (err, decodedToken) => {
        if (err) {
          console.log(err);
          res.status(400);
          next();
        } else {
          const user = await userModel.findById(decodedToken.id);
          res.status(200).json({ user: user.email });
          next();
        }
      }
    );
  } else {
    res.status(400);
    next();
  }
};

module.exports = { checkUser };

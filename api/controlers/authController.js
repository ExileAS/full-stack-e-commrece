const userModel = require("../models/userModel");
require("dotenv").config();
const { createToken } = require("../utils/tokens");
const { handleErrors } = require("../utils/userRegisterErrors");
const { createSignupInfo } = require("../utils/createUserInfo");

module.exports.signup_post = async (req, res) => {
  const { email, password, sub, email_verified } = req.body;

  try {
    let user, token;
    const { info, verifyId } = createSignupInfo(email, password);
    if (email && password) {
      user = await userModel.create(info);
      token = createToken(user._id);
    } else if (sub && email_verified) {
      user = {
        email: email,
      };
      token = createToken(sub);
    }
    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 24 * 2,
      httpOnly: true,
    });
    res.status(201).json({ user: user.email, verifyId });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 24 * 2,
      httpOnly: true,
    });
    res.status(200).json({ user: user.email });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports.verify_user = (req, res) => {
  const { verifyId } = req.params;
  console.log(verifyId);
};

const userModel = require("../models/userModel");
const { createToken, createTempToken } = require("../utils/tokens");
const { handleErrors } = require("../utils/userRegisterErrors");
const { createSignupInfo } = require("../utils/createUserInfo");

const signup_post = async (req, res) => {
  const { email, password, sub, email_verified, isSeller, phoneNumber } =
    req.body;

  try {
    if (email && password) {
      const { info, send } = createSignupInfo(email, password);
      const user = await userModel.create({
        ...info,
        password,
        role: isSeller ? "seller" : "customer",
        phoneNumber: isSeller ? phoneNumber : null,
      });
      send();
      const { token, name, options } = createTempToken(user._id);
      res.cookie(name, token, options);
      res.status(201).json({ user: user.email });
    } else if (sub && email_verified) {
      const existingUser = await userModel.findOne({ email: email });
      if (existingUser) {
        return res
          .status(409)
          .json({ err: "already registerd as non-google account" });
      }
      const { token, name, options } = createToken(sub);
      res.cookie(name, token, options);
      res.status(201).json({ user: email });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.login(email, password);
    if (user.verified) {
      const { token, name, options } = createToken(user._id);
      res.cookie(name, token, options);
      res.cookie("jwtTemp", "", { maxAge: 1 });
      res.status(200).json({
        user: user.email,
        purchaseCount: user.purchaseCount,
        totalPayments: user.totalPayments,
        phoneNumber: user.phoneNumber,
      });
    } else {
      const { token, name, options } = createTempToken(user._id);
      res.cookie(name, token, options);
      res.status(401).json({ unverifiedEmail: user.email });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = { signup_post, login_post, logout_get };

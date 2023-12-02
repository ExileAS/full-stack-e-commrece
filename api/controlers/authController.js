const userModel = require("../models/userModel");
require("dotenv").config();
const { createToken, createTempToken } = require("../utils/tokens");
const {
  handleErrors,
  handleVerifyErrors,
} = require("../utils/userRegisterErrors");
const { createSignupInfo } = require("../utils/createUserInfo");

const signup_post = async (req, res) => {
  const { email, password, sub, email_verified } = req.body;

  try {
    if (email && password) {
      const { info, send } = createSignupInfo(email, password);
      const user = await userModel.create({ ...info, password });
      send();
      const { token, name, options } = createTempToken(user._id);
      res.cookie(name, token, options);
      res.status(201).json({ user: user.email });
    } else if (sub && email_verified) {
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
      res.status(200).json({ user: user.email });
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

const verify_user_url = async (req, res) => {
  const { verifyId, email } = req.params;
  const url = `${process.env.SERVER_URI}/shoppingBag/verifyUser/${verifyId}&${email}`;
  try {
    const user = await userModel.findOne({ email: email });
    handleVerifyErrors(user, "url");
    const verifiedUser = await userModel.findOneAndUpdate(
      { _id: user._id, "verifyURL.url": url },
      {
        $set: { verified: true, verifiedAt: Date.now(), expireAt: null },
      }
    );
    if (verifiedUser) {
      res.send("<h2>Verified Succesfully</h2>");
    } else {
      const failedVerify = await userModel.findOneAndUpdate(
        { email: email },
        {
          $inc: { verifyAttempts: 1 },
        }
      );
      res.send("<h2>Verification link incorrect or expired</h2>");
    }
  } catch (err) {
    console.log(err);
    res.send(`<h2>${err.message}</h2>`);
  }
};

const verify_user_otp = async (req, res) => {
  const { otp, email } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    handleVerifyErrors(user, "otp");
    const verifiedUser = await userModel.findOneAndUpdate(
      { _id: user._id, "OTP.otp": otp },
      {
        $set: { verified: true, verifiedAt: Date.now(), expireAt: null },
      }
    );
    if (verifiedUser) {
      res.status(200).json({ success: "verified successfully!" });
    } else {
      const failedVerify = await userModel.findOneAndUpdate(
        { email: email },
        {
          $inc: { verifyAttempts: 1 },
        }
      );
      res.status(400).json({ err: "wrong otp" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ err: err.message });
  }
};

const resend_msg = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email: email });
    handleVerifyErrors(user, "", true);
    const { info, send } = createSignupInfo(email);
    const { verifyURL, OTP } = info;
    const existingUser = await userModel.findOneAndUpdate(
      { _id: user._id, email: email },
      {
        $set: {
          verifyURL: verifyURL,
          OTP: OTP,
        },
        $inc: { resendAttempts: 1 },
      }
    );
    if (existingUser) {
      send();
      res.status(200).json({ success: "verification resent" });
    } else {
      res
        .status(404)
        .json({ err: "something wrong happened, please try again later" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = {
  logout_get,
  resend_msg,
  verify_user_otp,
  verify_user_url,
  login_post,
  signup_post,
};

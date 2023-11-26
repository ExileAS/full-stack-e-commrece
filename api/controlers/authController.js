const userModel = require("../models/userModel");
require("dotenv").config();
const { createToken, createTempToken } = require("../utils/tokens");
const { handleErrors } = require("../utils/userRegisterErrors");
const { createSignupInfo } = require("../utils/createUserInfo");

module.exports.signup_post = async (req, res) => {
  const { email, password, sub, email_verified } = req.body;

  try {
    let user, token;
    if (email && password) {
      const { info, send } = createSignupInfo(email, password);
      user = await userModel.create({ ...info, password });
      send();
      token = createTempToken(user._id);
      res.cookie("jwtTemp", token, {
        maxAge: 1000 * 60 * 60 * 2,
        httpOnly: true,
      });
      res.status(201).json({ user: user.email });
    } else if (sub && email_verified) {
      token = createToken(sub);
      res.cookie("jwt", token, {
        maxAge: 1000 * 60 * 60 * 24 * 2,
        httpOnly: true,
      });
      res.status(201).json({ user: email });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.login(email, password);
    if (user.verified) {
      const token = createToken(user._id);
      res.cookie("jwt", token, {
        maxAge: 1000 * 60 * 60 * 24 * 2,
        httpOnly: true,
      });
      res.cookie("jwtTemp", "", { maxAge: 1 });
      res.status(200).json({ user: user.email });
    } else {
      res.status(401).json({ unverified: true });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.verify_user_url = async (req, res) => {
  const { verifyId, email } = req.params;
  const url = `${process.env.SERVER_URI}/shoppingBag/verifyUser/${verifyId}&${email}`;
  const user = await userModel.findOne({ email: email });
  if (!user) {
    res.status(404).send("<h2>user not found<h2>");
    return;
  }
  if (user.verified) {
    res.status(409).send("<h2>Already Verified</h2>");
    return;
  }
  const valid = user.verifyURL.expireAt > Date.now();
  if (valid) {
    const verifiedUser = await userModel.findOneAndUpdate(
      { _id: user._id, "verifyURL.url": url },
      {
        $set: { verified: true, verifiedAt: Date.now(), expireAt: null },
      }
    );
    verifiedUser
      ? res.send("<h2>Verified Succesfully</h2>")
      : res.send("<h2>Verification link incorrect or expired</h2>");
  } else {
    res.status(400).send("<h2>Expired!</h2>");
  }
};

module.exports.verify_user_otp = async (req, res) => {
  const { otp, email } = req.body;
  const user = await userModel.findOne({ email: email });
  if (!user) {
    res.status(404).json({ status: "user not found" });
    return;
  }
  if (user.verified) {
    res.status(409).json({ status: "already verified" });
    return;
  }
  if (user.verifyAttempts > 4) {
    res.status(403).json({ status: "too many attempts!" });
    return;
  }
  const valid = user.OTP.expireAt > Date.now();
  if (valid) {
    const verifiedUser = await userModel.findOneAndUpdate(
      { _id: user._id, "OTP.otp": otp },
      {
        $set: { verified: true, verifiedAt: Date.now(), expireAt: null },
      }
    );
    if (verifiedUser) {
      res.status(200).json({ status: "verified successfully!" });
    } else {
      const failedVerify = await userModel.findOneAndUpdate(
        { email: email },
        {
          $inc: { verifyAttempts: 1 },
        }
      );
      res.status(400).json({ status: "wrong otp" });
    }
  } else {
    res.status(400).json({ err: "invalid user status" });
  }
};

module.exports.resend_msg = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email: email });
  if (!user) {
    res.status(404).json({ status: "user not found" });
    return;
  }
  if (user.verified) {
    res.status(409).json({ status: "already verified" });
    return;
  }
  if (user.resendAttempts > 5) {
    res.status(403).json({ status: "too many resend attempts!" });
    return;
  }
  const valid = user.expireAt > Date.now();

  if (valid) {
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
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

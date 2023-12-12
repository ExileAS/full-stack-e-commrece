const userModel = require("../models/userModel");
require("dotenv").config();
const generateUniqueId = require("generate-unique-id");
const { handleVerifyErrors } = require("../utils/userRegisterErrors");
const { createSignupInfo } = require("../utils/createUserInfo");
const { encrypt, decrypt } = require("../utils/textEncryption");
const resetingModel = require("../models/resetingUsersModel");
const { createResetToken } = require("../utils/tokens");

const verify_user_url = async (req, res) => {
  const { verifyId, email } = req.params;
  const url = `${process.env.SERVER_URI}/shoppingBag/verifyUser/${verifyId}&${email}`;
  try {
    const user = await userModel.findOne({ encryptedEmail: email });
    handleVerifyErrors(user, "url");
    const verifiedUser = await userModel.findOneAndUpdate(
      { _id: user._id, "verifyURL.url": url },
      {
        $set: { verified: true, verifiedAt: Date.now(), expireAt: null },
      }
    );
    if (verifiedUser) {
      res.send("<h2>Verified Succesfully</h2>");
      const deletedUnwantedFields = await userModel.findOneAndUpdate(
        {
          _id: verifiedUser._id,
          verified: true,
          encryptedEmail: email,
        },
        {
          $unset: {
            verifyURL: 1,
            OTP: 1,
            verifyAttempts: 1,
            resendAttempts: 1,
            encryptedEmail: 1,
            expireAt: 1,
          },
        }
      );
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
      const deletedUnwantedFields = await userModel.findOneAndUpdate(
        {
          _id: verifiedUser._id,
          verified: true,
          email: email,
        },
        {
          $unset: {
            verifyURL: 1,
            OTP: 1,
            verifyAttempts: 1,
            resendAttempts: 1,
            encryptedEmail: 1,
            expireAt: 1,
          },
        }
      );
      console.log(deletedUnwantedFields);
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
    res.status(err.code).json({ err: err.message });
  }
};

const resend_msg = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email: email });
    handleVerifyErrors(user, "", true);
    const { info, send } = createSignupInfo(email);
    const { verifyURL, OTP, encryptedEmail } = info;
    const existingUser = await userModel.findOneAndUpdate(
      { _id: user._id, email: email },
      {
        $set: {
          verifyURL,
          OTP,
          encryptedEmail,
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
    res.status(err.code).json({ err: err.message });
  }
};

const create_reset_info = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email: email, verified: true });
    if (!user) throw new Error("user not found");
    const existing = await resetingModel.findOne({ email: email });
    if (existing && existing.attempts >= 3) {
      throw new Error("too many attempts");
    }
    const { token, name, options } = createResetToken(user._id);
    res.cookie(name, token, options);
    const { encryptedText, iv, key } = encrypt(`${user._id}`);
    if (existing) {
      const updated = await resetingModel.findOneAndUpdate(
        { email: email },
        {
          $set: { iv: iv, key: key },
          $inc: { attempts: 1 },
        }
      );
      const saved = await updated.save();
      return res
        .status(301)
        .json({ id: encryptedText, remainingAttempts: 3 - saved.attempts });
    }
    const userReset = await resetingModel.create({
      id: user._id,
      email: user.email,
      iv: iv,
      key: key,
    });
    const savedReset = await userReset.save();
    res.status(301).json({ id: encryptedText, remainingAttempts: 3 });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const reset_password = async (req, res) => {
  const { email, resetId } = req.body;
  try {
    const resetingUser = await resetingModel.findOne({ email: email });
    if (!resetingUser) {
      throw new Error("incorrect email");
    }
    if (resetingUser.attempts >= 3) {
      throw new Error("too many attempts");
    }
    const { iv, key, id } = resetingUser;
    const decrypted = decrypt({ encryptedText: resetId, iv }, key);
    console.log(decrypted);
    if (decrypted === id) {
      // create email with new otp and send to user
    }

    res.status(200).json({});
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

module.exports = {
  resend_msg,
  verify_user_otp,
  verify_user_url,
  create_reset_info,
  reset_password,
};

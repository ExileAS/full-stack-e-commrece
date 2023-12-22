const sellerModel = require("../models/sellerModel");
const { userModel } = require("../models/userModel");
const createSellerSignupInfo = require("../utils/createSellerInfo");
const { passowrdHash } = require("../utils/textEncryption");
const {
  createTempToken,
  createSellerToken,
  createToken,
} = require("../utils/tokens");
const {
  handleErrors,
  handlePhoneVerifyErrors,
} = require("../helpers/userRegisterErrors");
const { limiter } = require("../middleware/rateLimiter");

module.exports.signup_seller = async (req, res) => {
  const { email, password, companyName, phoneNumber } = req.body;

  try {
    await userModel.checkDup(email);
    const hashedPassword = await passowrdHash(password);
    const { info, send } = createSellerSignupInfo(
      email,
      companyName,
      phoneNumber
    );
    const seller = await sellerModel.create({
      ...info,
      password: hashedPassword,
      role: "seller",
    });
    await send();
    const { name, token, options } = createTempToken(seller._id);
    res.cookie(name, token, options);
    res.status(201).json({ seller: seller.email });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ err: err.message, errors });
    console.log(err);
  }
};

module.exports.resend_otp = async (req, res) => {
  const { email } = req.body;

  try {
    const seller = await sellerModel.findOne({ email });
    handlePhoneVerifyErrors(seller, "", true);
    const { info, send } = createSellerSignupInfo(
      email,
      "",
      seller.phoneNumber.number
    );
    seller.phoneOTP = info.phoneOTP;
    seller.phoneURL = info.phoneURL;
    seller.resendAttempts++;
    await seller.save();
    await send();
    res.status(200).json({ info: "verification resent" });
  } catch (err) {
    res.status(err.code || 400);
    console.log(err);
  }
};

module.exports.seller_login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await sellerModel.login(email, password);
    if (user.verified && user.phoneNumber.verified) {
      const { token, name, options } = createToken(user._id);
      const {
        token: tokenSeller,
        name: nameSeller,
        options: optionsSeller,
      } = createSellerToken(user._id);
      res.cookie(name, token, options);
      res.cookie(nameSeller, tokenSeller, optionsSeller);
      res.cookie("jwtTemp", "", { maxAge: 1 });
      res.status(200).json({
        user: user.email,
        purchaseCount: user.purchaseCount,
        totalPayments: user.totalPayments,
        phoneNumber: user.phoneNumber,
        listings: user.listings,
      });
      limiter.resetKey(req.ip);
    } else {
      const { token, name, options } = createTempToken(user._id);
      res.cookie(name, token, options);
      res.status(401).json({ unverifiedEmail: user.email });
    }
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.verify_phone_otp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const seller = await sellerModel.findOne({ email });
    handlePhoneVerifyErrors(seller, "otp");
    if (seller.phoneOTP.otp !== otp) {
      console.log(otp, seller.phoneOTP.otp);
      seller.verifyAttempts++;
      await seller.save();
      throw new Error("wrong OTP");
    }

    const test = await sellerModel.findOneAndUpdate(
      { email },
      {
        $unset: { phoneURL: 1, phoneOTP: 1 },
        $set: { "phoneNumber.verified": true },
      },
      { new: true }
    );
    console.log(test);
    res.status(200).json({ info: "verified successfully!" });
  } catch (err) {
    res.status(400).json({ err: err.message });
    console.log(err);
  }
};

module.exports.verify_phone_url = async (req, res) => {
  const { verifyId, email } = req.params;
  const url = `${process.env.SERVER_URI}/shoppingBag/verify-phone-seller/${verifyId}&${email}`;
  try {
    const seller = await sellerModel.findOne({ encryptedEmail: email });
    handlePhoneVerifyErrors(seller, "url");
    if (seller.phoneURL.url !== url) {
      seller.verifyAttempts++;
      await seller.save();
      throw new Error("invalid url");
    }

    const test = await sellerModel.findByIdAndUpdate(
      { _id: seller._id },
      {
        $unset: { phoneOTP: 1, phoneURL: 1 },
        $set: { "phoneNumber.verified": true },
      },
      { new: true }
    );
    console.log(test);
    res.status(200).send("<h2>Verified Succesfully</h2>");
  } catch (err) {
    console.log(err);
    res.send(`<h2>${err.message}</h2>`);
  }
};

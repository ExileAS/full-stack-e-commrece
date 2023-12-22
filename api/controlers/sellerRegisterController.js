const sellerModel = require("../models/sellerModel");
const { userModel } = require("../models/userModel");
const createSellerSignupInfo = require("../utils/createSellerInfo");
const { passowrdHash } = require("../utils/textEncryption");
const { createTempToken, createSellerToken } = require("../utils/tokens");
const {
  handleErrors,
  handleVerifyErrors,
} = require("../helpers/userRegisterErrors");

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
    handleVerifyErrors(seller, "", true);
    const { info, send } = createSellerSignupInfo(
      email,
      "",
      seller.phoneNumber
    );
    const OTP = info.OTP;
    seller.OTP = OTP;
    await seller.save();
    await send();
    res.status(200).json({ success: "verification resent" });
  } catch (err) {
    res.status(err.code || 400);
    console.log(err);
  }
};

module.exports.seller_login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await sellerModel.login(email, password);
    if (user.verified) {
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

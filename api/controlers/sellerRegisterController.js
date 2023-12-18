const sellerModel = require("../models/sellerModel");
const { userModel } = require("../models/userModel");
const createSellerSignupInfo = require("../utils/createSellerInfo");
const { passowrdHash } = require("../utils/textEncryption");
const { createTempToken } = require("../utils/tokens");
const { handleErrors } = require("../utils/userRegisterErrors");

// signup, login, logout, verify phoneNum otp.
module.exports.signup_seller = async (req, res) => {
  const { email, password, companyName, phoneNumber } = req.body;

  try {
    const existsInUserModel = await userModel.findOne({ email });
    if (existsInUserModel) {
      throw new Error("email already exists");
    }
    const hashedPassword = await passowrdHash(password);
    const { info, send } = createSellerSignupInfo(
      email,
      companyName,
      phoneNumber
    );
    const seller = await sellerModel.create({
      ...info,
      password: hashedPassword,
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

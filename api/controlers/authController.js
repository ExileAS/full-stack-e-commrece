const { userModel } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const generateUniqueId = require("generate-unique-id");
require("dotenv").config();
const { sendToUser, mailOptions } = require("../services/mailer");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: 60 * 60 * 24 * 2,
  });
};

const handleErrors = (err) => {
  const errors = { email: "", password: "" };

  if (err.message === "incorrect password") {
    errors.password = "incorrect password";
  }

  if (err.message === "user not registered") {
    errors.email = "incorrect email";
  }

  if (err.code === 11000) {
    errors.email = "email is already registered";
    return errors;
  }
  console.log(err.message);
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports.signup_post = async (req, res) => {
  const { email, password, sub, email_verified } = req.body;
  const verifyId = generateUniqueId({
    length: 40,
  });
  const URLID = generateUniqueId({
    length: 60,
  });
  const otp = generateUniqueId({
    length: 6,
    useLetters: false,
  });
  const url = `${process.env.SERVER_URI}/shoppingBag/verifyUser/${URLID}`;
  try {
    let user, token;
    if (email && password) {
      user = await userModel.create({
        email,
        password,
        verified: false,
        verifyURL: {
          url,
        },
        OTP: {
          otp,
        },
      });
      token = createToken(user._id);
      sendToUser({
        ...mailOptions,
        to: email,
        text: `verify your account using this url: \n ${url} \n or with otp: \n ${otp}`,
      });
    } else if (sub && email_verified) {
      token = createToken(sub);
      user = {
        email: email,
      };
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

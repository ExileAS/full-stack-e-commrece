const { sendToUser, mailOptions } = require("../services/mailer");
const generateUniqueId = require("generate-unique-id");
require("dotenv").config();

const createSignupInfo = (email, password) => {
  if (!email || !password) return { info: "", verifyId: "" };
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
  const info = {
    email,
    password,
    verified: false,
    verifyURL: {
      url,
    },
    OTP: {
      otp,
    },
  };
  sendToUser({
    ...mailOptions,
    to: email,
    text: `welcome ${email.substring(
      0,
      email.indexOf("@")
    )}, verify your account using this url:\n${url}\nor with otp:\n${otp}`,
  });
  return {
    info,
    verifyId,
  };
};

module.exports = { createSignupInfo };

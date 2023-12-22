const { sendToUser, mailOptions } = require("../services/mailer");
const generateUniqueId = require("generate-unique-id");
require("dotenv").config();
const { encrypt } = require("./textEncryption");

const createSignupInfo = (email, isSeller = false) => {
  const encryptedEmail = encrypt(email).encryptedText;
  const URLID = isSeller
    ? generateUniqueId({
        length: 90,
      })
    : generateUniqueId({
        length: 80,
      });
  const otp = generateUniqueId({
    length: 6,
    useLetters: false,
  });
  const url = `${process.env.SERVER_URI}/shoppingBag/verifyUser/${URLID}&${encryptedEmail}`;
  const info = {
    email,
    verified: false,
    verifyURL: {
      url,
    },
    OTP: {
      otp,
    },
    encryptedEmail,
  };
  const send = () =>
    sendToUser({
      ...mailOptions,
      to: email,
      text: `welcome ${email.substring(
        0,
        email.indexOf("@")
      )}, verify your account using this url:\n${url}\nor with otp:\n${otp}`,
    });
  return { info, send };
};

module.exports = { createSignupInfo };

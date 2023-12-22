const sendSMS = require("../services/SMS.twilio");
const generateUniqueId = require("generate-unique-id");
const { encrypt } = require("./textEncryption");
require("dotenv").config();
const createSellerSignupInfo = (email, companyName, phoneNumber) => {
  const encryptedEmail = encrypt(email).encryptedText;
  const URLID = generateUniqueId({
    length: 80,
  });
  const otp = generateUniqueId({
    length: 8,
    useLetters: false,
  });
  const url = `${process.env.SERVER_URI}/shoppingBag/verifyUser/${URLID}&${encryptedEmail}`;
  const info = {
    email,
    verified: false,
    companyName,
    phoneNumber: {
      number: phoneNumber,
    },
    phoneOTP: {
      otp,
    },
    phoneURL: {
      url,
    },
    encryptedEmail,
  };
  const send = async () => await sendSMS(phoneNumber, otp, url);
  return { info, send };
};

module.exports = createSellerSignupInfo;

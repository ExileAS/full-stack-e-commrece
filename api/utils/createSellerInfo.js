const sendSMS = require("../services/SMS.twilio");
const generateUniqueId = require("generate-unique-id");
const createSellerSignupInfo = (email, companyName, phoneNumber) => {
  const otp = generateUniqueId({
    length: 8,
    useLetters: false,
  });
  const info = {
    email,
    verified: false,
    companyName,
    phoneNumber,
    numberVerifyOtp: {
      otp,
    },
  };
  const send = async () => await sendSMS(phoneNumber, otp);
  return { info, send };
};

module.exports = createSellerSignupInfo;

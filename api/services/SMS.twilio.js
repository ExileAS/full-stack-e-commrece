require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const senderNum = process.env.TWILIO_PHONE_NUM;

const client = require("twilio")(accountSid, authToken, {
  autoRetry: true,
  maxRetries: 3,
});

const sendSMS = async (phoneNumber, otp) => {
  const message = await client.messages.create({
    body: `verify your seller phone number \nusing this otp: \n${otp}`,
    to: phoneNumber,
    from: senderNum,
  });
  console.log(message.sid);
};

module.exports = sendSMS;

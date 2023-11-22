const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.MAILER_EMAIL}`,
    pass: `${process.env.MAILER_PASS}`,
  },
});

const mailOptions = {
  from: `${process.env.MAILER_EMAIL}`,
  to: "",
  subject: "Verify Your Account",
  text: "",
};

const sendToUser = (mailOptions) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendToUser, mailOptions };

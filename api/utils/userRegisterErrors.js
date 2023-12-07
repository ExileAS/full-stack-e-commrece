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
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const handleVerifyErrors = (user, verifyMethod, resend = false) => {
  if (!user) {
    throw new Error("user not found!");
  }
  const validUser = user.expireAt === null || user.expireAt > Date.now();
  const validOtp =
    resend || user.OTP.expireAt > Date.now() || verifyMethod === "url";
  const validUrl =
    resend || user.verifyURL.expireAt > Date.now() || verifyMethod === "otp";
  if (!validUser || !validOtp || !validUrl) {
    throw new Error("user or verify method expired");
  }
  if (user.verified) {
    throw new Error("already verified");
  }
  if (user.verifyAttempts > 4 || user.resendAttempts > 4) {
    throw new Error("too many attempts!");
  }
};

module.exports = { handleErrors, handleVerifyErrors };

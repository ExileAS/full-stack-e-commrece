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
  let err;
  if (!user) {
    if (verifyMethod !== "url") {
      err = new Error("user not found!");
      err.code = 404;
    } else {
      err = new Error("already verified");
      err.code = 409;
    }
  }
  const validUser = user.expireAt === null || user.expireAt > Date.now();
  const validOtp =
    resend || user.OTP.expireAt > Date.now() || verifyMethod === "url";
  const validUrl =
    resend || user.verifyURL.expireAt > Date.now() || verifyMethod === "otp";
  if (!validUser || !validOtp || !validUrl) {
    err = new Error("user or verify method expired");
    err.code = 403;
  }
  if (user.verified) {
    err = new Error("already verified");
    err.code = 409;
  }
  if (user.verifyAttempts > 4 || user.resendAttempts > 4) {
    err = new Error("too many attempts!");
    err.code = 429;
  }
  if (err) throw err;
};

module.exports = { handleErrors, handleVerifyErrors };

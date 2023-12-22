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
  const validUser = user.expireAt > Date.now();
  const validOtp =
    resend || user.OTP.expireAt > Date.now() || verifyMethod === "url";
  const validUrl =
    resend || user.verifyURL.expireAt > Date.now() || verifyMethod === "otp";
  if (!validUser || !validOtp || !validUrl) {
    err = new Error("account or verify method expired");
    err.code = 403;
  }
  if (user.verifyAttempts > 6 || user.resendAttempts > 6) {
    err = new Error("too many attempts!");
    err.code = 429;
  }
  if (user.verified) {
    err = new Error("already verified");
    err.code = 409;
  }
  if (err) throw err;
};

const handlePhoneVerifyErrors = (seller, verifyMethod, resend = false) => {
  let err;
  if (!seller) {
    if (verifyMethod !== "url") {
      err = new Error("not found!");
      err.code = 404;
    } else {
      err = new Error("already verified");
      err.code = 409;
    }
  }
  const validSeller = seller.expireAt > Date.now();
  const validOtp =
    resend || seller.phoneOTP.expireAt > Date.now() || verifyMethod === "url";
  const validUrl =
    resend || seller.phoneURL.expireAt > Date.now() || verifyMethod === "otp";
  if (!validSeller || !validOtp || !validUrl) {
    err = new Error("account or verify method expired");
    err.code = 403;
  }
  if (seller.verifyAttempts > 6 || seller.resendAttempts > 6) {
    err = new Error("too many attempts!");
    err.code = 429;
  }
  if (seller.verified) {
    err = new Error("already verified");
    err.code = 409;
  }
  if (err) throw err;
};

module.exports = { handleErrors, handleVerifyErrors, handlePhoneVerifyErrors };

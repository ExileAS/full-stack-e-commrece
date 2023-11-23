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

module.exports = { handleErrors };

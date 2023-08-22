const { userModel } = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, "extremely secret secret of all secrets 777", {
    expiresIn: 60 * 60 * 2,
  });
};

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

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 2,
      httpOnly: true,
    });
    res.status(201).json({ user: user.email });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 2,
      httpOnly: true,
    });
    res.status(200).json({ user: user.email });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

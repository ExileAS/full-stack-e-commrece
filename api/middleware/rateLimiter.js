const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  max: 5,
  message: "please try again later.",
  headers: true,
});

module.exports = {
  limiter,
};

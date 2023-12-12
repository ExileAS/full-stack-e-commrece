const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      errors: {
        email: "Too many attempts please try again later.",
      },
    });
  },
  headers: true,
});

module.exports = {
  limiter,
};

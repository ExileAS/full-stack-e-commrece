const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 4,
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

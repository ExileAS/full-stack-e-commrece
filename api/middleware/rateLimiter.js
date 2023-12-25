const rateLimit = require("express-rate-limit");

const getKey = (req, res) => {
  return req.ip;
};

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: getKey,
  handler: (req, res) => {
    limiter.windowMs *= 2;

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

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  max: 6,
  handler: (req, res) => {
    res.status(429).json({
      errors: {
        email: "Too many attempts please try again later.",
      },
    });
  },
  headers: true,
});

// const resetLimiter = (req, res) => {
//   if(req.successfullLogin) {
//     limiter.resetKey(req.ip);
//   }
// }

module.exports = {
  limiter,
};

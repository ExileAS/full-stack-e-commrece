const { Router } = require("express");
const {
  signup_post,
  login_post,
  logout_get,
} = require("../controlers/userRigisterController");
const { csrfProtection } = require("../middleware/authMiddleware");
const { limiter } = require("../middleware/rateLimiter");
const { clearTokens } = require("../middleware/tokenClearer");
const router = Router();

router.post("/api/signup", csrfProtection, clearTokens, signup_post);
router.post(
  "/api/login",
  (req, res, next) => {
    res.on("finish", () => {
      console.log("Response headers:", res.getHeaders());
    });
    next();
  },
  csrfProtection,
  limiter,
  clearTokens,
  login_post
);
router.get("/api/logout", logout_get);

module.exports = router;

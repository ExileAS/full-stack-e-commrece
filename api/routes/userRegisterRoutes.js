const { Router } = require("express");
const {
  signup_post,
  login_post,
  logout_get,
} = require("../controlers/userRigisterController");
const { csrfProtection } = require("../middleware/authMiddleware");
const { limiter } = require("../middleware/rateLimiter");
const router = Router();

router.post("/api/signup", csrfProtection, signup_post);
router.post("/api/login", csrfProtection, limiter, login_post);
router.get("/api/logout", logout_get);

module.exports = router;

const { Router } = require("express");
const {
  signup_post,
  login_post,
  logout_get,
  verify_user_url,
  verify_user_otp,
  resend_msg,
} = require("../controlers/authController");
const { requireAuth, csrfProtection } = require("../middleware/authMiddleware");

const router = Router();

router.get(`/shoppingbag/verifyUser/:verifyId&:email`, verify_user_url);
router.post("/api/verifyOTP", csrfProtection, requireAuth, verify_user_otp);
router.post("/api/signup", csrfProtection, signup_post);
router.post("/api/login", csrfProtection, login_post);
router.get("/api/logout", logout_get);
router.post("/api/resend", csrfProtection, requireAuth, resend_msg);

module.exports = router;

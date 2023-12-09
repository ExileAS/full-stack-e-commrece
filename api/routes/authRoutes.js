const { Router } = require("express");
const {
  verify_user_url,
  verify_user_otp,
  resend_msg,
} = require("../controlers/authController");
const { requireAuth, csrfProtection } = require("../middleware/authMiddleware");

const router = Router();

router.get(`/shoppingbag/verifyUser/:verifyId&:email`, verify_user_url);
router.post("/api/verifyOTP", csrfProtection, requireAuth, verify_user_otp);
router.post("/api/resend", csrfProtection, requireAuth, resend_msg);

module.exports = router;

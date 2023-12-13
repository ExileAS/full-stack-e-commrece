const { Router } = require("express");
const {
  verify_user_url,
  verify_user_otp,
  resend_msg,
  create_reset_info,
  reset_password,
  verify_reset_otp,
} = require("../controlers/authController");
const {
  requireAuth,
  csrfProtection,
  requireResetToken,
} = require("../middleware/authMiddleware");

const router = Router();

router.get(`/shoppingbag/verifyUser/:verifyId&:email`, verify_user_url);
router.post("/api/verifyOTP", csrfProtection, requireAuth, verify_user_otp);
router.post("/api/resend", csrfProtection, requireAuth, resend_msg);
router.post("/api/api/requireReset", csrfProtection, create_reset_info);
router.post(
  "/api/resetUserPass",
  csrfProtection,
  requireResetToken,
  reset_password
);
router.post(
  "/api/otp-passwordReset",
  csrfProtection,
  requireResetToken,
  verify_reset_otp
);
module.exports = router;

// signup, login, logout
const { Router } = require("express");

const {
  signup_seller,
  resend_otp,
  seller_login,
  verify_phone_otp,
  verify_phone_url,
} = require("../controlers/sellerRegisterController");
const { csrfProtection, requireAuth } = require("../middleware/authMiddleware");
const { clearTokens } = require("../middleware/tokenClearer");
const { limiter } = require("../middleware/rateLimiter");

const router = Router();

router.post("/api/signup-seller", csrfProtection, clearTokens, signup_seller);
router.post("/api/resend-seller-otp", csrfProtection, requireAuth, resend_otp);
router.post(
  "/api/login-seller",
  csrfProtection,
  limiter,
  clearTokens,
  seller_login
);
router.post(
  "/api/verify-seller-phone",
  csrfProtection,
  requireAuth,
  verify_phone_otp
);
// :verifyId&:email
router.get(
  `/shoppingbag/verify-phone-seller/:verifyId&:email`,
  verify_phone_url
);
module.exports = router;

const { Router } = require("express");
const {
  signup_post,
  login_post,
  logout_get,
  verify_user_url,
  verify_user_otp,
} = require("../controlers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.get(`/shoppingbag/verifyUser/:verifyId&:email`, verify_user_url);
router.post("/api/verifyOTP", requireAuth, verify_user_otp);
router.post("/api/signup", signup_post);
router.post("/api/login", login_post);
router.get("/api/logout", logout_get);

module.exports = router;

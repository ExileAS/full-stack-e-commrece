const { Router } = require("express");
const {
  signup_post,
  login_post,
  logout_get,
  verify_user,
} = require("../controlers/authController");

const router = Router();

router.get(`/shoppingbag/verifyUser/:verifyId`, verify_user);
router.post("/api/signup", signup_post);
router.post("/api/login", login_post);
router.get("/api/logout", logout_get);

module.exports = router;

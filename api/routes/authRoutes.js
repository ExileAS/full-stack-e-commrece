const { Router } = require("express");
const {
  signup_post,
  login_post,
  logout_get,
} = require("../controlers/authController");

const router = Router();

router.post("/api/signup", signup_post);
router.post("/api/login", login_post);
router.get("/api/logout", logout_get);

module.exports = router;

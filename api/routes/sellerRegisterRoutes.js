// signup, login, logout
const { Router } = require("express");

const { signup_seller } = require("../controlers/sellerRegisterController");
const { csrfProtection } = require("../middleware/authMiddleware");
const { clearTokens } = require("../middleware/tokenClearer");

const router = Router();

router.post("/api/signup-seller", csrfProtection, clearTokens, signup_seller);
module.exports = router;

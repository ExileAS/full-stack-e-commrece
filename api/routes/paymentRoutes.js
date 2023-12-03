const { Router } = require("express");
const router = Router();
const {
  payment_post,
  confirm_payment,
} = require("../controlers/paymentController");
const { checkUser, csrfProtection } = require("../middleware/authMiddleware");

router.post("/api/payment", csrfProtection, checkUser, payment_post);
router.post("/api/confirmPayment", checkUser, confirm_payment);

module.exports = router;

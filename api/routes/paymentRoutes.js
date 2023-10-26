const { Router } = require("express");
const router = Router();
const {
  payment_post,
  confirm_payment,
} = require("../controlers/paymentController");

router.post("/api/payment", payment_post);
router.post("/api/confirmPayment", confirm_payment);

module.exports = router;

const { Router } = require("express");
const router = Router();
const {
  payment_post,
  confirm_payment,
  update_user_orders,
} = require("../controlers/paymentController");
const { checkUser, csrfProtection } = require("../middleware/authMiddleware");

router.post("/api/payment", csrfProtection, checkUser, payment_post);
router.post("/api/confirmPayment", checkUser, confirm_payment);
router.post("/api/updateUserOrders", checkUser, update_user_orders);

module.exports = router;

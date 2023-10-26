const { Router } = require("express");
const router = Router();
const { payment_post } = require("../controlers/paymentController");

router.post("/api/payment", payment_post);

module.exports = router;

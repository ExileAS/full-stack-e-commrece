const { Router } = require("express");

const {
  csrfProtection,
  requireSellerToken,
} = require("../middleware/authMiddleware");

const router = Router();
router.patch("/api/editProduct", csrfProtection, requireSellerToken);
router.post("/api/add-product", csrfProtection, requireSellerToken);

module.exports = router;

const { Router } = require("express");
const router = Router();
const {
  product_get,
  confirm_available,
} = require("../controlers/productsController");
const {
  checkUser,
  verifyOriginMiddleware,
} = require("../middleware/authMiddleware");

router.get("/api/all-products", verifyOriginMiddleware, product_get);
router.post("/api/confirmAvailable", checkUser, confirm_available);

module.exports = router;

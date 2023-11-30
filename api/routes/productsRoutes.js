const { Router } = require("express");
const router = Router();
const {
  product_get,
  confirm_available,
} = require("../controlers/productsController");
const { checkUser } = require("../middleware/authMiddleware");

router.get("/api/all-products", product_get);
router.post("/api/confirmAvailable", checkUser, confirm_available);

module.exports = router;

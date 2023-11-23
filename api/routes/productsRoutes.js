const { Router } = require("express");
const router = Router();
const {
  product_get,
  confirm_available,
} = require("../controlers/productsController");

router.get("/api/all-products", product_get);
router.post("/api/confirmAvailable", confirm_available);

module.exports = router;

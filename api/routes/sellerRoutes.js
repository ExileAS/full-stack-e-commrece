const { Router } = require("express");
const {
  get_all_sellers,
  edit_product,
  product_post,
} = require("../controlers/sellerController");

const {
  csrfProtection,
  requireSellerToken,
} = require("../middleware/authMiddleware");

const router = Router();

router.get("/api/allSellers", get_all_sellers);
router.patch(
  "/api/editProduct",
  csrfProtection,
  requireSellerToken,
  edit_product
);
router.post(
  "/api/add-product",
  csrfProtection,
  requireSellerToken,
  product_post
);

module.exports = router;

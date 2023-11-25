const { Router } = require("express");
const {
  get_all_sellers,
  edit_product,
  product_post,
} = require("../controlers/sellerController");

// const { requireSellerAuth } = require("../middleware/authMiddleware");

const router = Router();

router.get("/api/allSellers", get_all_sellers);
router.patch("/api/editProduct", edit_product);
router.post("/api", product_post);

module.exports = router;

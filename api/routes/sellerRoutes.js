const { Router } = require("express");
const {
  get_all_sellers,
  edit_product,
} = require("../controlers/sellerController");

const router = Router();

router.get("/api/allSellers", get_all_sellers);
router.patch("/api/editProduct", edit_product);

module.exports = router;

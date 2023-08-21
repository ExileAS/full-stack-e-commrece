const { Router } = require("express");
const {
  product_get,
  product_post,
  ordered_post,
  retreive_ordered_post,
} = require("../controlers/productController");

const router = Router();

router.get("/api/all-products", product_get);
router.post("/api", product_post);
router.post("/api/post-ordered", ordered_post);
router.post("/api/retrieveOrdered", retreive_ordered_post);

module.exports = router;

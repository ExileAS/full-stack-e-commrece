const { Router } = require("express");
const {
  product_get,
  product_post,
  ordered_post,
  retreive_ordered_post,
  update_order_patch,
  order_delete,
} = require("../controlers/productController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.get("/api/all-products", product_get);
router.post("/api", requireAuth, product_post);
router.post("/api/post-ordered", ordered_post);
router.post("/api/retrieveOrdered", retreive_ordered_post);
router.patch("/api/updateOrder", update_order_patch);
router.delete("/api/deleteOrder", order_delete);

module.exports = router;

const { Router } = require("express");
const {
  product_get,
  ordered_post,
  retreive_ordered_post,
  update_order_patch,
  order_delete,
  confirm_available,
} = require("../controlers/productController");

const router = Router();

router.get("/api/all-products", product_get);
router.post("/api/post-ordered", ordered_post);
router.post("/api/retrieveOrdered", retreive_ordered_post);
router.patch("/api/updateOrder", update_order_patch);
router.delete("/api/deleteOrder", order_delete);
router.post("/api/confirmAvailable", confirm_available);

module.exports = router;

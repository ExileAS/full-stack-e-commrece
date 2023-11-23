const { Router } = require("express");
const {
  ordered_post,
  retreive_ordered_post,
  update_order_patch,
  order_delete,
} = require("../controlers/orderedProductsController");

const router = Router();

router.post("/api/post-ordered", ordered_post);
router.post("/api/retrieveOrdered", retreive_ordered_post);
router.patch("/api/updateOrder", update_order_patch);
router.delete("/api/deleteOrder", order_delete);

module.exports = router;

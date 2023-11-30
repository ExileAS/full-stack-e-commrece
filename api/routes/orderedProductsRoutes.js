const { Router } = require("express");
const {
  ordered_post,
  retreive_ordered_post,
  update_order_patch,
  order_delete,
} = require("../controlers/orderedProductsController");
const { checkUser } = require("../middleware/authMiddleware");

const router = Router();

router.post("/api/post-ordered", checkUser, ordered_post);
router.post("/api/retrieveOrdered", checkUser, retreive_ordered_post);
router.patch("/api/updateOrder", checkUser, update_order_patch);
router.delete("/api/deleteOrder", checkUser, order_delete);

module.exports = router;

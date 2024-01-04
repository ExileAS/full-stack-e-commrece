const { Router } = require("express");
const {
  ordered_post,
  retreive_ordered_post,
  update_order_patch,
  order_delete,
} = require("../controlers/orderedProductsController");
const { checkUser, csrfProtection } = require("../middleware/authMiddleware");

const router = Router();

router.post("/api/post-ordered", csrfProtection, checkUser, ordered_post);
router.post(
  "/api/retrieveOrdered",
  csrfProtection,
  checkUser,
  retreive_ordered_post
);
router.patch("/api/updateOrder", csrfProtection, checkUser, update_order_patch);
router.delete("/api/deleteOrder", csrfProtection, checkUser, order_delete);

module.exports = router;

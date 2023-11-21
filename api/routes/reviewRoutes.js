const { Router } = require("express");
const router = Router();

const {
  get_reviews,
  add_review,
  edit_review,
} = require("../controlers/reviewController");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/api/reviews", get_reviews);
router.post("/api/addReview", add_review);
router.patch("/api/editReview", edit_review);

module.exports = router;

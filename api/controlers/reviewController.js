const ReviewsModel = require("../models/reviews");

module.exports.get_reviews = async (req, res) => {
  try {
    const reviews = await ReviewsModel.find();
    console.log(reviews);
    res.status(200).json({ reviews });
  } catch (err) {
    console.log(err);
  }
};

module.exports.add_review = async (req, res) => {
  const { id, email, review } = req.body;
  const product = await ReviewsModel.create({
    productId: id,
    info: {
      reviewCount: 1,
      rating: review,
      customers: [{ name: email, comment: "", rating: review }],
    },
  });
  res.json({ product });
  console.log(product);
};

module.exports.edit_review = async (req, res) => {};

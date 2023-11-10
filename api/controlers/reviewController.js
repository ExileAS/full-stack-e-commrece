const ReviewsModel = require("../models/reviewsModel");

module.exports.get_reviews = async (req, res) => {
  try {
    const reviews = await ReviewsModel.find();
    res.status(200).json({ reviews });
  } catch (err) {
    console.log(err);
  }
};

module.exports.add_review = async (req, res) => {
  const { id, email, review, productName } = req.body;
  const product = await ReviewsModel.create({
    productId: id,
    productName: productName,
    info: {
      reviewCount: 1,
      rating: review,
      customers: [{ name: email, comment: "", rating: review }],
    },
  });
  console.log(product);
  res.json({ product });
};

module.exports.edit_review = async (req, res) => {};

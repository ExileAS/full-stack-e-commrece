const { info } = require("winston");
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
  const { id, email, review, productName, comment } = req.body;
  const product = await ReviewsModel.create({
    productId: id,
    productName: productName,
    info: {
      reviewCount: 1,
      rating: review,
      customers: [{ name: email, comment, rating: review }],
    },
  });
  res.json({ product });
};

module.exports.edit_review = async (req, res) => {
  const { id, email, review, comment } = req.body;
  try {
    const existing = await ReviewsModel.findOne({ productId: id });
    const customers = existing.info.customers;
    const rating = existing.info.rating;
    const reviewCount = existing.info.reviewCount;
    const currCustomer = customers.find((customer) => customer.name === email);
    let newReview;
    if (currCustomer) {
      const customerReview = currCustomer.rating;
      const newRating = rating + (review - customerReview) / reviewCount;
      newReview = await ReviewsModel.findOneAndUpdate(
        { productId: id },
        { $set: { "info.rating": newRating } }
      );
      const updatedUserReview = await ReviewsModel.findOneAndUpdate(
        { productId: id, "info.customers.name": email },
        { $set: { "info.customers.$[someUser].rating": review } },
        { arrayFilters: [{ "someUser.name": email }] }
      );
    } else {
      const newCustomer = { name: email, comment, rating: review };
      const newRating = (rating * reviewCount + review) / (reviewCount + 1);
      newReview = await ReviewsModel.findOneAndUpdate(
        { productId: id },
        {
          $push: { "info.customers": newCustomer },
          $set: {
            "info.rating": newRating,
          },
          $inc: { "info.reviewCount": 1 },
        }
      );
    }
    res.status(200).json({ newReview });
  } catch (err) {
    console.log(err);
  }
};

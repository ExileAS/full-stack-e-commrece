const logger = require("../logs/winstonLogger");
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
  logger.info(req.body);
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
  // module.exports.editReview = async (req, res) => {};

  // const Customers = new Schema({
  //     name: String,
  //     comment: String,
  //     rating: {
  //       type: Number,
  //       min: [1],
  //       max: [5],
  //     },
  //   });

  //   const reviewsModel = new Schema({
  //     productId: {
  //       type: String,
  //       required: true,
  //     },
  //     info: {
  //       reviewCount: {
  //         type: Number,
  //         required: true,
  //       },
  //       rating: {
  //         type: Number,
  //         required: true,
  //       },
  //       customers: [Customers],
  //     },
  //   });
};

module.exports.edit_review = async (req, res) => {};

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Customer = new Schema({
  name: {
    type: String,
  },
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    min: [1],
    max: [5],
  },
});

const reviewsModel = new Schema({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  info: {
    reviewCount: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "min review is 1"],
      max: [5, "max review is 5"],
    },
    customers: [Customer],
  },
});

const Reviews = mongoose.model("review", reviewsModel);

module.exports = Reviews;

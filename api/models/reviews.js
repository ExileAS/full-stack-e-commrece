const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Customers = new Schema({
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
  info: {
    reviewCount: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    customers: [Customers],
  },
});

const Reviews = mongoose.model("review", reviewsModel);

module.exports = Reviews;

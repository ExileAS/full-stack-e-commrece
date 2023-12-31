const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderedProductSchema = new Schema(
  {
    confirmId: {
      type: String,
      unique: true,
    },
    list: {
      type: Array,
    },
    customerInfo: {
      type: Object,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    customerPayed: {
      type: Boolean,
      default: false,
    },
    shipmentStartedAt: {
      type: Date,
      default: null,
    },
    total: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

const OrderedProductModel = mongoose.model(
  "Ordered Product",
  OrderedProductSchema
);

module.exports = { OrderedProductModel, OrderedProductSchema };

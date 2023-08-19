const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderedProductSchema = new Schema(
  {
    confirmId: {
      type: String,
    },
    list: {
      type: Array,
    },
    customerInfo: {
      type: Object,
    },
  },
  { timestamps: true }
);

const OrderedProductModel = mongoose.model(
  "Ordered Product",
  OrderedProductSchema
);

module.exports = OrderedProductModel;

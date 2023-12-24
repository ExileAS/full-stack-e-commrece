const mongoose = require("mongoose");
const { productSchema } = require("./productModel");
const { userSchema } = require("./userModel");
const {
  loginStatic,
  checkForDuplicate,
} = require("../helpers/staticSchemaMethods");
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  ...userSchema.obj,
  // overrides:
  verified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: {
    type: Date,
    default: function () {
      if (this.verified && this.phoneNumber.verified) {
        return Date.now();
      }
    },
  },
  phoneNumber: {
    number: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  // new:
  companyName: {
    type: String,
  },
  phoneOTP: {
    otp: {
      type: String,
    },
    expireAt: {
      type: Date,
      default: function () {
        if (!this.verified) {
          return Date.now() + 1000 * 60 * 10;
        }
      },
    },
  },
  phoneURL: {
    url: {
      type: String,
    },
    expireAt: {
      type: Date,
      default: function () {
        if (!this.verified) {
          return Date.now() + 1000 * 60 * 20;
        }
      },
    },
  },
  listings: [productSchema],
});

sellerSchema.statics.login = async function (email, password) {
  return await loginStatic(email, password, this);
};

sellerSchema.statics.checkDup = async function (email) {
  await checkForDuplicate(email, this);
};

const sellerModel = mongoose.model("seller", sellerSchema);

module.exports = sellerModel;

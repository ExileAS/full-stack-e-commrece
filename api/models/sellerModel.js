const mongoose = require("mongoose");
const { default: isEmail } = require("validator/lib/isemail");
const { productSchema } = require("./productModel");
const { order } = require("./userModel");
const loginStatic = require("../utils/loginStatic");
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  email: {
    type: String,
    required: [true, "please enter an email"],
    lowercase: true,
    unique: true,
    validate: [isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*]).{8,}$/.test(
          value
        );
      },
      message:
        "please use a stronger password \n (8+ characters with letters (uppercase included), numbers and symbols)",
    },
  },
  verified: {
    type: Boolean,
    default: false,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
  },
  expireAt: {
    type: Date,
    default: function () {
      if (!this.verified) {
        return Date.now() + 1000 * 60 * 60 * 24 * 2;
      }
    },
  },
  OTP: {
    otp: {
      type: Number,
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
  verifyAttempts: {
    type: Number,
    default: function () {
      if (!this.verified) {
        return 0;
      }
    },
  },
  resendAttempts: {
    type: Number,
    default: function () {
      if (!this.verified) {
        return 1;
      }
    },
  },
  reseting: {
    type: Boolean,
  },
  products: [productSchema],
  orders: [order],
  purchaseCount: {
    type: Number,
    default: 0,
  },
  totalPayments: {
    type: Number,
    default: 0,
  },
});

sellerSchema.statics.login = loginStatic;

const sellerModel = mongoose.model("seller", sellerSchema);

module.exports = sellerModel;

// 1- create seller doc when seller type email, password and number, validate unique email in both seller and user models before create.
// 2- create otp for phone confirm and send msg
// 3- validate otp with max retries, resend, seller-jwt etc...
// 4- correct otp -> create in user model with role seller and update seller doc to consider phone verified
// 5- navigate to login-seller
// 6- use user verification system on the existing doc with correct email
// 7- modify last step to check when verified if it's seller or customer (use a helper function)
// 8- in the helper function validate seller doc and remove from user model.
// 9- verified user with seller role will have their phone included
// 10- we can check for that in the very last step so we can decide if this is a seller and should be moved to seller model
// notes: 1- attach isSeller to req.body with middleware that checks seller token
// 2- remember to add cleanup for expired seller docs.
// 3- create jwt and jwtSeller on login.

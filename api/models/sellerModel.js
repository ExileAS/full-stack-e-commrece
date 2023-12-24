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

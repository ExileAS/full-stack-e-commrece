const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
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
      message: "please use a stronger password",
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
  expireAt: {
    type: Date,
    default: function () {
      if (!this.verified) {
        return Date.now() + 1000 * 60 * 60 * 24 * 2;
      }
    },
  },
  // verify via url or otp using user model.
  // verify number here and delete from user when verified.
  numberVerifyOtp: {
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
});

const seller = mongoose.model("seller", sellerSchema);

module.exports = seller;

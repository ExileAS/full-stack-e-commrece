const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { default: isEmail } = require("validator/lib/isemail");

const {
  loginStatic,
  checkForDuplicate,
} = require("../helpers/staticSchemaMethods");
const order = new Schema({
  orderId: {
    type: String,
    required: true,
  },
  list: {
    type: Array,
    default: [],
  },
  total: {
    type: Number,
    default: 0,
  },
});

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "please enter an email"],
    lowercase: true,
    unique: true,
    validate: [isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
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
  verifiedAt: {
    type: Date,
  },
  verifyURL: {
    url: {
      type: String,
    },
    expireAt: {
      type: Date,
      default: function () {
        if (!this.verified) {
          return Date.now() + 1000 * 60 * 60 * 3;
        }
      },
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
  expireAt: {
    type: Date,
    default: function () {
      if (!this.verified) {
        return Date.now() + 1000 * 60 * 60 * 24 * 2;
      }
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
  role: {
    type: String,
  },
  phoneNumber: {
    type: String,
    default: null,
  },
  purchaseCount: {
    type: Number,
    default: 0,
  },
  totalPayments: {
    type: Number,
    default: 0,
  },
  orders: [order],
  encryptedEmail: {
    type: String,
  },
  reseting: {
    type: Boolean,
  },
});

userSchema.statics.login = async function (email, password) {
  return await loginStatic(email, password, this);
};

userSchema.statics.checkDup = async function (email) {
  await checkForDuplicate(email, this);
};

const userModel = mongoose.model("user", userSchema);

module.exports = { userModel, order, userSchema };

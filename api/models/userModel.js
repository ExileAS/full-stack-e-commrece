const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { default: isEmail } = require("validator/lib/isemail");
const bcrypt = require("bcrypt");
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
    required: [true, "please enter a password"],
    minlength: [8, "minimum password length is 8"],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verifyURL: {
    url: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
      default: function () {
        return Date.now() + 1000 * 60 * 60 * 3;
      },
    },
  },
  verifiedAt: {
    type: Date,
  },
  OTP: {
    otp: {
      type: Number,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
      default: function () {
        return Date.now() + 1000 * 60 * 10;
      },
    },
  },
  expireAt: {
    type: Date,
    required: true,
    default: function () {
      return Date.now() + 1000 * 60 * 60 * 24 * 2;
    },
  },
  verifyAttempts: {
    type: Number,
    default: 0,
  },
  resendAttempts: {
    type: Number,
    default: 1,
  },
  role: {
    type: String,
    default: "customer",
  },
  phoneNumber: {
    type: Number,
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
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    } else {
      throw Error("incorrect password");
    }
  } else {
    throw Error("user not registered");
  }
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

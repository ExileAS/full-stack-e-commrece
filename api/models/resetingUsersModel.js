const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resetingUserSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3,
  },
  iv: {
    type: Buffer,
    required: true,
  },
  OTP: {
    otp: {
      type: Number,
    },
    expireAt: {
      type: Date,
      default: function () {
        return Date.now() + 1000 * 60 * 8;
      },
    },
  },
  key: {
    type: Buffer,
    required: true,
  },
  deletionAt: {
    type: Date,
    default: function () {
      return Date.now() + 1000 * 60 * 60 * 2;
    },
  },
});

const resetingModel = mongoose.model("reseting-user", resetingUserSchema);
module.exports = resetingModel;

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
    max: [3, "maximum send attempts reached."],
  },
  iv: {
    type: String,
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
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
      max: [3, "maximum attempts reached."],
    },
  },
  key: {
    type: String,
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

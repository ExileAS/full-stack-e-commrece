const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { default: isEmail } = require("validator/lib/isemail");
const bcrypt = require("bcrypt");

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
  },
  verifyURL: {
    type: String,
  },
  OTP: {
    type: Number,
  },
  unverifiedExpiresIn: {
    type: Date,
  },
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

module.exports = { userModel };

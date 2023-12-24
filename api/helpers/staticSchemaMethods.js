const bcrypt = require("bcrypt");
async function loginStatic(email, password, that) {
  const user = await that.findOne({ email });
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
}

async function checkForDuplicate(email, that) {
  const duplicate = await that.findOne({ email });
  if (duplicate) {
    throw new Error("Email Already Exists!");
  }
}

module.exports = { loginStatic, checkForDuplicate };

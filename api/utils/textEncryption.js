const crypto = require("crypto");
const bcrypt = require("bcrypt");
require("dotenv").config();

const encrypt = (text) => {
  try {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return {
      iv: iv.toString("hex"),
      encryptedText: encrypted,
      key: key.toString("hex"),
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};

const decrypt = (encryptedData) => {
  try {
    const key = Buffer.from(encryptedData.key, "hex");
    const iv = Buffer.from(encryptedData.iv, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(
      encryptedData.encryptedText,
      "hex",
      "utf-8"
    );
    decrypted += decipher.final("utf-8");

    return decrypted;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const passowrdHash = async (password) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

module.exports = { encrypt, decrypt, passowrdHash };

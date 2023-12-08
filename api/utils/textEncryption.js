const crypto = require("crypto");
require("dotenv").config();

const encrypt = (text) => {
  try {
    const key = crypto.randomBytes(32);
    const keyBuffer = Buffer.from(key, "utf-8");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(keyBuffer),
      iv
    );
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return { iv: iv.toString("hex"), encryptedText: encrypted };
  } catch (err) {
    console.log(err);
    return null;
  }
};

// const decrypt = (encryptedData, key) => {
//   try {
//     const keyBuffer = Buffer.from(key, "utf-8");
//     const decipher = crypto.createDecipheriv(
//       "aes-256-cbc",
//       Buffer.from(keyBuffer),
//       Buffer.from(encryptedData.iv, "hex")
//     );
//     let decrypted = decipher.update(
//       encryptedData.encryptedText,
//       "hex",
//       "utf-8"
//     );
//     decrypted += decipher.final("utf-8");
//     return decrypted;
//   } catch (err) {
//     console.log(err);
//     return null;
//   }
// };

module.exports = { encrypt };
const crypto = require("crypto");

const generateRandomToken = (length) => {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .slice(0, length)
    .replace(/\+/g, "0")
    .replace(/\//g, "0");
};

module.exports = { generateRandomToken };

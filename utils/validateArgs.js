const { parsePhoneNumberFromString } = require("libphonenumber-js");

module.exports = {
  isValidPhoneNumber: (phoneNumber) => {
    try {
      // const parsedNumber = parsePhoneNumberFromString(phoneNumber, "ZZ");

      // if (parsedNumber && parsedNumber.isValid()) {
      //   console.log("Valid phone number:", parsedNumber.number);

      //   return parsedNumber.number;
      // }

      const phoneRegex = /^\+?\d+$/;
      if (phoneRegex.test(phoneNumber)) return phoneNumber;

      return false;
    } catch (error) {
      console.log("error in isValidPhoneNumber ", error);
    }
  },

  isValidWebsiteUrl: async (url) => {
    try {
      const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      return urlRegex.test(url);
    } catch (error) {
      console.log("error in isValidWebsiteUrl ", error);
    }
  },
};

const axios = require("axios");

const callReimagine = async (endpoint, method, data = {}) => {
  const options = {
    method,
    url: `${process.env.REIMAGINE_BASE_URL}${endpoint}`,
    headers: {
      Authorization: `Bearer ${process.env.REIMAGINE_API_KEY}`,
      "Content-Type": "application/json",
      "api-key": process.env.REIMAGINE_API_KEY,
    },
    data,
  };
  try {
    const response = await axios(options);
    return response.data;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

module.exports = callReimagine;

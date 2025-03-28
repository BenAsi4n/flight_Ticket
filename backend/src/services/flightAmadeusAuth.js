const axios = require("axios");
require("dotenv").config();

const AMADEUS_AUTH_URL =
  "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;

const getAccessToken = async () => {
  try {
    const response = await axios.post(
      AMADEUS_AUTH_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: AMADEUS_CLIENT_ID,
        client_secret: AMADEUS_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Lỗi khi lấy Access Token:",
      error.response?.data || error.message
    );
    return null;
  }
};

module.exports = { getAccessToken };

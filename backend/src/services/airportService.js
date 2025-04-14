const axios = require("axios");
require("dotenv").config();
const auth  = require("./flightAmadeusAuth");

const AMADEUS_API_URL =
  "https://test.api.amadeus.com/v1/reference-data/locations";

// 🔍 Tìm sân bay từ Amadeus
const getAirports = async (keyword) => {
  if (!keyword) return [];

  try {
    const token = await auth.getAccessToken();
    if (!token) return [];

    const response = await axios.get(AMADEUS_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        keyword: keyword.trim(),
        subType: "AIRPORT,CITY", // ✅ đúng format enum của Aadeus
      },
    });

    return response.data.data || [];
  } catch (error) {
    console.error("❌ Lỗi gọi API Amadeus:", error.response?.data || error.message);
    return [];
  }
};

module.exports = { getAirports };

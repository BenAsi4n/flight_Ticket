const axios = require("axios");
require("dotenv").config();

const API_URL = "https://api.api-ninjas.com/v1/airports";
const API_KEY = process.env.NINJAS_API_KEY;

const callApi = async (params) => {
  try {
    const response = await axios.get(API_URL, {
      params,
      headers: { "X-Api-Key": API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Lỗi khi gọi API Ninjas:",
      error.response?.data || error.message
    );
    return [];
  }
};

const getAirports = async (keyword) => {
  if (!keyword) return [];

  let result = [];

  // 1️⃣ Tìm theo IATA nếu keyword có 3 ký tự
  if (keyword.lenght === 3) {
    result = await callApi({ iata: keyword.toUpperCase() });
  }
  // // 2️⃣ Nếu không có kết quả, thử tìm theo tên
  // if (result.length === 0) {
  //   result = await callApi({ name: keyword });
  // }
  // // 3️⃣ Nếu vẫn không có kết quả, thử tìm theo thành phố
  // if (result.length === 0) {
  //   result = await callApi({ city: keyword });
  // }

  return result;
};

module.exports = { getAirports };

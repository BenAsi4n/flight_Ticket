const axios = require("axios");
require("dotenv").config();
const { getAccessToken } = require("./flightAmadeusAuth");

const AMADEUS_API_URL = "https://test.api.amadeus.com/v1/booking/flight-orders"; // URL đặt vé Amadeus

// Hàm gửi request đặt vé
const bookFlight = async (bookingData) => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return { error: "Không thể xác thực với Amadeus" };

    const response = await axios.post(AMADEUS_API_URL, bookingData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    // const data = response.data;
    
    return response;
  } catch (error) {
    console.error("Lỗi khi đặt vé:", error.response?.data || error.message);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || error.message,
    };
  }
};

module.exports = { bookFlight };

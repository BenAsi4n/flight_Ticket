const axios = require("axios");
const { getAccessToken } = require("./flightAmadeusAuth");

const AMADEUS_API_URL =
  "https://test.api.amadeus.com/v2/shopping/flight-offers";

// Các tham sô trong hàm searchFlights
// origin: điểm đi
// destination: điểm đến
// departureDate: ngày đi
//returnDate: ngày về (*nếu không truyền tham số này thì hàm sẽ là tìm chuyến bay 1 chiều)
//adults: số lượng người (vé).
//travelClass: hạng vé, có 4 hạng vé ECONOMY(phổ thông), PREMIUM_ECONOMY(phổ thông đặc biệt), BUSINESS(thương gia), FIRST(hạng nhất)
//(*có thể truyền tham số này hoặc không vì mặc định là ECONOMY)
//airline: hãng bay(*có thể truyền tham số này hoặc không để tìm theo hãng bay).

const searchFlights = async ({
  origin,
  destination,
  departureDate,
  returnDate,
  adults,
  travelClass,
  airline,
}) => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return { error: "Không thể xác thực với Amadeus" };

    const params = {
      originLocationCode: origin.toUpperCase(),
      destinationLocationCode: destination.toUpperCase(),
      departureDate,
      adults,
      travelClass: travelClass || "ECONOMY",
      currencyCode: "VND",
    };

    if (returnDate) {
      params.returnDate = returnDate; // Thêm ngày về nếu là vé khứ hồi
    }

    const response = await axios.get(AMADEUS_API_URL, {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    let flights = response.data.data || [];

    // 🛠 Chỉ lọc theo hãng bay nếu người dùng có yêu cầu
    if (airline) {
      flights = flights.filter((flight) =>
        flight.validatingAirlineCodes.includes(airline.toUpperCase())
      );
    }

    return flights;
  } catch (error) {
    console.error(
      "Lỗi khi gọi API Amadeus:",
      error.response?.data || error.message
    );
    return { error: "Không thể lấy dữ liệu chuyến bay" };
  }
};

module.exports = { searchFlights };

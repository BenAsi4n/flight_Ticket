const axios = require("axios");
require("dotenv").config();
const { getAccessToken } = require("./flightAmadeusAuth");
const db = require("../config/db");

const AMADEUS_API_URL = "https://test.api.amadeus.com/v1/booking/flight-orders";

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

    const data = response.data.data;

    // Kiểm tra an toàn dữ liệu
    const traveler = data.travelers?.[0];
    const flightOffer = data.flightOffers?.[0];
    const segments = flightOffer?.itineraries?.[0]?.segments;

    if (!traveler || !flightOffer || !segments) {
      console.error("Dữ liệu không đầy đủ để lưu vé.");
      return { error: "Dữ liệu không hợp lệ." };
    }

    const firstname = traveler.name.firstName;
    const lastname = traveler.name.lastName;
    const email = traveler.contact?.emailAddress || null;
    const total_price = flightOffer.price.total;

    const origin = segments[0].departure.iataCode;
    const departure_at = segments[0].departure.at;
    const destination = segments[segments.length - 1].arrival.iataCode;
    const arrival_at = segments[segments.length - 1].arrival.at;

    // Lưu vào bảng tickets
    const insertQuery = `
      INSERT INTO tickets 
        (firstname, lastname, origin, destination, total_price, email, departure_at, arrival_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.execute(insertQuery, [
      firstname,
      lastname,
      origin,
      destination,
      total_price,
      email,
      departure_at,
      arrival_at,
    ]);

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

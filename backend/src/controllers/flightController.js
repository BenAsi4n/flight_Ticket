const flightService = require("../services/flightService");

const searchFlights = async (req, res) => {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    travelClass,
    airline,
  } = req.query;

  if (!origin || !destination || !departureDate || !adults) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  const flights = await flightService.searchFlights({
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    travelClass,
    airline,
  });
  res.json(flights);
};

module.exports = { searchFlights };

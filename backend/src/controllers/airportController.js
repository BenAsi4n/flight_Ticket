const airportService = require("../services/airportService");

const searchAirports = async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).json({ message: "Vui lòng nhập từ khóa" });
  }

  const airports = await airportService.getAirports(keyword);
  res.json(airports);
};

module.exports = { searchAirports };

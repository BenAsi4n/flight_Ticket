const bookingService = require("../services/bookingService");
const pool = require("../config/db"); // Đảm bảo bạn import đúng pool kết nối từ db.js

const bookFlight = async (req, res) => {
  try {
    const bookingData = req.body; // Dữ liệu đặt vé từ frontend
    const response = await bookingService.bookFlight(bookingData);

    if (response.status === 201) {
      const data = response.data;
      
      return res.status(201).json({ message: "Đặt vé thành công" });
    } else {
      return res
        .status(response.status)
        .json({ message: "Đặt vé thất bại", error: response.data });
    }
  } catch (error) {
    console.error("Lỗi khi đặt vé:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { bookFlight };

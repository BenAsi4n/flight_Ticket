const bookingService = require("../services/bookingService");
const pool = require("../config/db"); // Đảm bảo bạn import đúng pool kết nối từ db.js

const bookFlight = async (req, res) => {
  try {
    const bookingData = req.body; // Dữ liệu đặt vé từ frontend
    const response = await bookingService.bookFlight(bookingData);

    if (response.status === 201) {
      // Xử lý dữ liệu response và lưu vào database
      // const { data } = response;

      // // Lấy thông tin từ response
      // console.log(data);
      // const traveler = data.travelers[0];
      // const flightSegments = data.flightOffers[0].itineraries[0].segments;
      // if (flightSegments < 1) {
      //   const destination = flightSegments[0].arrival.iataCode;
      // } else {
      //   const destination =
      //     flightSegments[flightSegments.length - 1].arrival.iataCode; // Điểm đến của segment cuối
      // }
      // const totalPrice = parseFloat(data.flightOffers[0].price.grandTotal);
      // const email = traveler.contact.emailAddress;
      // const departureAt = flightSegments[0].departure.at; // Thời gian khởi hành từ segment đầu
      // const arrivalAt = flightSegments[flightSegments.length - 1].arrival.at; // Thời gian đến từ segment cuối

      // // Câu lệnh SQL để lưu dữ liệu vào bảng `tickets`
      // const query = `
      //   INSERT INTO tickets (firstname, lastname, origin, destination, total_price, email, departure_at, arrival_at)
      //   VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      // `;

      // const values = [
      //   traveler.name.firstName,
      //   traveler.name.lastName,
      //   flightSegments[0].departure.iataCode, // Điểm đi từ segment đầu
      //   destination, // Điểm đến từ segment cuối
      //   totalPrice,
      //   email,
      //   departureAt,
      //   arrivalAt,
      // ];

      // // Thực hiện câu lệnh SQL để chèn dữ liệu vào cơ sở dữ liệu
      // await pool.query(query, values);

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

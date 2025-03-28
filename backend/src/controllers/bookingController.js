const axios = require("axios");
const db = require("../config/db"); // Kết nối database

const bookFlight = async (req, res) => {
  try {
    const { flight, passenger, contact } = req.body;

    if (!flight || !passenger || !contact) {
      return res.status(400).json({ message: "Thiếu thông tin đặt vé!" });
    }

    // 1️⃣ Gửi request đặt vé lên Amadeus
    const amadeusResponse = await axios.post(
      "https://test.api.amadeus.com/v1/booking/flight-orders",
      {
        data: {
          type: "flight-order",
          flightOffers: [flight],
          travelers: [
            {
              id: "1",
              firstName: passenger.first_name,
              lastName: passenger.last_name,
              gender: passenger.gender === "Nam" ? "MALE" : "FEMALE",
              dateOfBirth: passenger.dob,
              documents: [
                {
                  type: "PASSPORT",
                  number: passenger.cccd,
                  expiryDate: passenger.cccd_expiry,
                },
              ],
              contact: {
                emailAddress: contact.email,
                phones: [{ deviceType: "MOBILE", number: contact.phone }],
              },
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AMADEUS_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 2️⃣ Nếu đặt vé thành công (status 200), lưu vào database
    if (amadeusResponse.status === 200) {
      const bookingId = amadeusResponse.data.id; // ID đơn đặt vé từ Amadeus

      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Lưu chuyến bay
        const [flightResult] = await connection.execute(
          `INSERT INTO flights (flight_id, airline, departure, arrival, departure_time, arrival_time, price)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            flight.id,
            flight.airline,
            flight.departure,
            flight.arrival,
            flight.departure_time,
            flight.arrival_time,
            flight.price,
          ]
        );

        const flightDbId = flightResult.insertId;

        // Lưu khách hàng
        const [passengerResult] = await connection.execute(
          `INSERT INTO passengers (first_name, last_name, gender, dob, cccd, cccd_expiry)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            passenger.first_name,
            passenger.last_name,
            passenger.gender,
            passenger.dob,
            passenger.cccd,
            passenger.cccd_expiry,
          ]
        );

        const passengerDbId = passengerResult.insertId;

        // Lưu thông tin liên hệ
        const [contactResult] = await connection.execute(
          `INSERT INTO contacts (title, first_name, last_name, phone, email)
           VALUES (?, ?, ?, ?, ?)`,
          [
            contact.title,
            contact.first_name,
            contact.last_name,
            contact.phone,
            contact.email,
          ]
        );

        const contactDbId = contactResult.insertId;

        // Lưu vé máy bay
        await connection.execute(
          `INSERT INTO tickets (booking_id, flight_id, passenger_id, contact_id, price)
           VALUES (?, ?, ?, ?, ?)`,
          [bookingId, flightDbId, passengerDbId, contactDbId, flight.price]
        );

        await connection.commit();
        connection.release();

        return res
          .status(200)
          .json({ message: "Đặt vé thành công!", bookingId });
      } catch (dbError) {
        await connection.rollback();
        connection.release();
        console.error("Lỗi khi lưu database:", dbError.message);
        return res.status(500).json({ message: "Lỗi khi lưu vào database" });
      }
    } else {
      return res.status(400).json({ message: "Không thể đặt vé với Amadeus!" });
    }
  } catch (error) {
    console.error("Lỗi đặt vé:", error.response?.data || error.message);
    return res.status(500).json({ message: "Lỗi server khi đặt vé" });
  }
};

module.exports = { bookFlight };

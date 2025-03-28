const express = require("express");
const cors = require("cors");
require("dotenv").config();

const flightRoutes = require("./routes/flightRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const airportRoutes = require("./routes/airportRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes); //Đặt vé
app.use("/api/airports", airportRoutes); //tìm sân bay

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

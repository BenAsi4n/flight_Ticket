//server
const express = require("express");
const cors = require("cors");
const session = require("express-session");
// const passport = require("passport");
// const { setupGoogleStrategy } = require("./services/auth_gg_Service");
require("dotenv").config();

const flightRoutes = require("./routes/flightRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const airportRoutes = require("./routes/airportRoutes");
// const authRoutes = require("./routes/auth_gg_Routes");
const app = express();
app.use(cors());
app.use(express.json());
// setupGoogleStrategy();

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.use("/auth", authRoutes); //login gg

app.use("/api/flights", flightRoutes); //tim chuyen bay
app.use("/api/bookings", bookingRoutes); //Đặt vé
app.use("/api/airports", airportRoutes); //tìm sân bay

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

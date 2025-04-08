//booking route
const express = require("express");
const { bookFlight } = require("../controllers/bookingController");

const router = express.Router();

router.post("/book", bookFlight);

module.exports = router;

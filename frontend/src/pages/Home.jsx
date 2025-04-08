import React, { useState } from "react";
import SearchFlight from "../components/SearchFlight";
import FlightList from "../components/FlightList";

const Home = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchData) => {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      tripType,
    } = searchData;
    let apiUrl = `http://localhost:5000/api/flights/search?origin=${origin}&destination=${destination}&departureDate=${departureDate}&adults=${adults}&children=${children}&infants=${infants}`;

    if (tripType === "roundtrip" && returnDate) {
      apiUrl += `&returnDate=${returnDate}`;
    }

    setLoading(true);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Không thể lấy dữ liệu từ server!");

      const results = await response.json();
      setFlights(results);
      
    } catch (error) {
      console.error("Lỗi khi tìm kiếm chuyến bay:", error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SearchFlight onSearch={handleSearch} />
      {loading ? (
        <p className="flight-list-container">Đang tìm kiếm chuyến bay...</p>
      ) : (
        !selectedFlight && (
          <FlightList flights={flights} onSelectFlight={setSelectedFlight} />
        )
      )}
    </div>
  );
};

export default Home;

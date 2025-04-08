import React, { useState } from "react";
import axios from "axios";
import "./SearchFlight.css";

const SearchFlight = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    adults: 1,
    children: 0,
    infants: 0,
    tripType: "oneway",
  });
  const today = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại theo định dạng YYYY-MM-DD
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);

  const fetchAirports = async (keyword) => {
    if (!keyword) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/airports/search?keyword=${keyword}`
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sân bay:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
    setErrors({ ...errors, [name]: "" });

    if (name === "origin" || name === "destination") {
      setActiveField(name);
      fetchAirports(value);
    }
  };

  const handleSelectAirport = (field, airport) => {
    setSearchData({
      ...searchData,
      [field]: `${airport.iata}`,
    });
    setSuggestions([]);
    setActiveField(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!searchData.origin) newErrors.origin = "Vui lòng nhập điểm đi";
    if (!searchData.destination)
      newErrors.destination = "Vui lòng nhập điểm đến";
    if (!searchData.departureDate)
      newErrors.departureDate = "Vui lòng chọn ngày đi";
    if (searchData.origin === searchData.destination) {
      newErrors.destination = "Điểm đi và điểm đến không thể giống nhau";
    }if(searchData.infants > searchData.adults) alert("Số người lớn phải hơn số em bé");
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log("🚀 Gửi request tìm kiếm:", searchData);
    onSearch(searchData);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="tripType"
              value="oneway"
              checked={searchData.tripType === "oneway"}
              onChange={handleChange}
            />{" "}
            Một chiều
          </label>
          <label>
            <input
              type="radio"
              name="tripType"
              value="roundtrip"
              checked={searchData.tripType === "roundtrip"}
              onChange={handleChange}
            />{" "}
            Khứ hồi
          </label>
        </div>

        {["origin", "destination"].map((field, index) => (
          <div key={index} className="input-group">
            <i>{field === "origin" ? "✈" : "📍"}</i>
            <input
              type="text"
              name={field}
              placeholder={
                field === "origin" ? "Nhập điểm đi..." : "Nhập điểm đến..."
              }
              className={errors[field] ? "error-input" : ""}
              value={searchData[field]}
              onChange={handleChange}
              onFocus={() => setActiveField(field)}
            />
            {errors[field] && (
              <small className="error-text">{errors[field]}</small>
            )}

            {/* Hiển thị danh sách gợi ý */}
            {activeField === field && suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((airport) => (
                  <li
                    key={airport.iataCode}
                    onClick={() => handleSelectAirport(field, airport)}
                  >
                    {airport.name}, {airport.city} - {airport.iata}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="input-group">
          <i>📅</i>
          <input
            type="date"
            name="departureDate"
            className={errors.departureDate ? "error-input" : ""}
            value={searchData.departureDate}
            onChange={handleChange}
            min={today}
          />
          {errors.departureDate && (
            <small className="error-text">{errors.departureDate}</small>
          )}
        </div>

        {searchData.tripType === "roundtrip" && (
          <div className="input-group">
            <i>📅</i>
            <input
              type="date"
              name="returnDate"
              value={searchData.returnDate}
              onChange={handleChange}
              min={searchData.departureDate || today}
            />
          </div>
        )}

        <div className="input-group">
          <i>👤</i>{" "}
          <input
            type="number"
            name="adults"
            value={searchData.adults}
            min="1"
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <i>🧒</i>{" "}
          <input
            type="number"
            name="children"
            value={searchData.children}
            min="0"
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <i>👶</i>{" "}
          <input
            type="number"
            name="infants"
            value={searchData.infants}
            min="0"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="search-btn">
          <i className="search-icon">🔍</i> Tìm chuyến bay
        </button>
      </form>
    </div>
  );
};

export default SearchFlight;

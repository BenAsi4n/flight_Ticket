import React, { useState } from "react";
import "./FlightList.css";

const FlightList = ({ flights }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showAllFlights, setShowAllFlights] = useState(true);
  const [bookingStatus, setBookingStatus] = useState(null);
  //state lay thongg tin
  const [passengerInfo, setPassengerInfo] = useState({});

  const today = new Date().toISOString().split("T")[0]; //ngay ien tai

  const handleBookFlight = async () => {
    if (!selectedFlight) return;

    // Tạo body cho request
    const requestData = {
      data: {
        type: "flight-order",
        flightOffers: [selectedFlight],
        travelers: selectedFlight.travelerPricings.map((tp, index) => ({
          id: (index + 1).toString(),
          dateOfBirth: passengerInfo[index]?.dateOfBirth || "2000-01-01",
          name: {
            firstName: passengerInfo[index]?.firstName || "First",
            lastName: passengerInfo[index]?.lastName || "Last",
          },
          gender: passengerInfo[index]?.gender || "MALE",
          contact: {
            emailAddress:
              passengerInfo[index]?.emailAddress || "noemail@example.com",
            phones: [
              {
                deviceType: "MOBILE",
                countryCallingCode: "84",
                number: "0123456789",
              },
            ],
          },
          documents: [
            {
              documentType: "PASSPORT",
              number: "X12345678",
              expiryDate: "2030-12-31",
              issuanceCountry: "VN",
              nationality: "VN",
              holder: true,
            },
          ],
        })),
      },
    };

    //check dữ liệu trên console
    console.log("📤 Dữ liệu gửi đi:", JSON.stringify(requestData, null, 2));
    // alert("Đã in dữ liệu booking lên console. Mở DevTools để xem.");

    // Gửi request đặt vé
    try {
      const response = await fetch("http://localhost:5000/api/bookings/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      setBookingStatus(result.message || "Đặt vé thành công!");
      alert(bookingStatus);
    } catch (error) {
      setBookingStatus("Đặt vé thất bại!");
    }
  };
  //cap nhat form và lay thong tin de post
  const handlePassengerChange = (index, field, value) => {
    setPassengerInfo((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  const handleSelectFlight = (flight) => {
    if (selectedFlight && selectedFlight === flight) {
      setSelectedFlight(null);
      setShowAllFlights(true);
    } else {
      setSelectedFlight(flight);
      setShowAllFlights(false);
    }
  };

  if (!flights || flights.length === 0) {
    return "";
  }

  return (
    //tom tat ve duoc chon
    <div className="container">
      {selectedFlight && (
        <div className="summary-tab">
          <h3>Tóm tắt vé</h3>
          {selectedFlight.travelerPricings.map((traveler, index) => (
            <p key={index}>
              {traveler.travelerType}: {traveler.quantity}{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: selectedFlight.price.currency,
              }).format(traveler.price.total)}
            </p>
          ))}
          Total:{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(selectedFlight?.price?.total)}
          <br></br>
        </div>
      )}
      <div className="flight-list-container">
        <h2 className="title">Danh sách chuyến bay</h2>
        <table className="flight-table">
          <thead>
            {/* <tr>
                <th>Hãng hàng không</th>
                <th>Chuyến đi</th>
                <th>Thời gian</th>
                <th>Giá</th>
                <th></th>
              </tr> */}
          </thead>
          <tbody>
            {(showAllFlights ? flights : [selectedFlight]).map(
              (flight, index) => {
                const segments = flight?.itineraries?.[0]?.segments || [];
                const currency = flight?.price?.currency || "VND";
                const amount = flight?.price?.grandTotal || 0;
                const formattedPrice = new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: currency,
                }).format(amount);

                return (
                  <React.Fragment key={index}>
                    {/* Hàng đầu tiên chứa thông tin chính */}
                    <tr className="flight-row">
                      <td style={{ color: "blue", fontWeight: "bold" }}>
                        {segments[0]?.operating?.carrierCode ||
                          segments[0]?.carrierCode ||
                          "Không xác định"}
                      </td>
                      <td colSpan={2}>
                        <strong>
                          {segments[0]?.departure?.iataCode || "N/A"} →{" "}
                          {segments[segments.length - 1]?.arrival?.iataCode ||
                            "N/A"}
                        </strong>
                      </td>
                      <td rowSpan={segments.length} style={{ color: "green" }}>
                        {formattedPrice}
                      </td>
                      <td rowSpan={segments.length}>
                        <button
                          className="select-btn"
                          onClick={() => handleSelectFlight(flight)}
                        >
                          {selectedFlight === flight ? "Chọn lại" : "Chọn"}
                        </button>
                      </td>
                    </tr>

                    {/* Các chặng bay được hiển thị bên dưới */}
                    {segments.map((segment, segIndex) => {
                      const departureAirport =
                        segment?.departure?.iataCode || "N/A";
                      const arrivalAirport =
                        segment?.arrival?.iataCode || "N/A";
                      const departureTime = segment?.departure?.at
                        ? new Date(segment.departure.at).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "N/A";
                      const arrivalTime = segment?.arrival?.at
                        ? new Date(segment.arrival.at).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "N/A";

                      return (
                        <tr
                          key={`${index}-${segIndex}`}
                          className="segment-row"
                        >
                          <td colSpan={2}>
                            {departureAirport} → {arrivalAirport}
                          </td>
                          <td style={{ color: "red" }}>
                            {departureTime} - {arrivalTime}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              }
            )}
          </tbody>
        </table>

        {selectedFlight &&
          selectedFlight.travelerPricings.map((travelerPricing, index) => {
            const typeMap = {
              ADULT: "Người lớn",
              CHILD: "Trẻ em",
              HELD_INFANT: "Em bé",
            };

            return (
              <div className="passenger-form" key={index}>
                <h3>
                  {typeMap[travelerPricing.travelerType] || "Không rõ"}{" "}
                  {index + 1}
                </h3>

                <label>Giới tính</label>
                <select
                  value={passengerInfo[index]?.gender || ""}
                  onChange={(e) =>
                    handlePassengerChange(index, "gender", e.target.value)
                  }
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </select>

                <label>Họ</label>
                <input
                  type="text"
                  value={passengerInfo[index]?.lastName || ""}
                  placeholder="Nhập họ"
                  onChange={(e) =>
                    handlePassengerChange(index, "lastName", e.target.value)
                  }
                />

                <label>Tên</label>
                <input
                  type="text"
                  value={passengerInfo[index]?.firstName || ""}
                  placeholder="Nhập tên"
                  onChange={(e) =>
                    handlePassengerChange(index, "firstName", e.target.value)
                  }
                />

                <label>Ngày sinh</label>
                <input
                  type="date"
                  value={passengerInfo[index]?.dateOfBirth || ""}
                  max={today}
                  onChange={(e) =>
                    handlePassengerChange(index, "dateOfBirth", e.target.value)
                  }
                />
                {travelerPricing.travelerType === "ADULT" && (
                  <>
                    <label>Email</label>
                    <input
                      type="email"
                      value={passengerInfo[index]?.emailAddress || ""}
                      placeholder="Nhập email"
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "emailAddress",
                          e.target.value
                        )
                      }
                    />
                  </>
                )}
              </div>
            );
          })}
        <button className="book-btn" onClick={handleBookFlight}>
          Đặt vé
        </button>
      </div>
    </div>
  );
};

export default FlightList;

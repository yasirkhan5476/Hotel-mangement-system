import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Footer from "./Footer";
import Header from "./Header";
import "../CSS/style.css";
import { useNavigate } from "react-router-dom";

export default function Booking() {
  const [roomPopupOpen, setRoomPopupOpen] = useState(false);
  const [roomCount, setRoomCount] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomsData, setRoomsData] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [user, setUser] = useState(null);

  const guestemail = localStorage.getItem("guestpanel");
  const role = localStorage.getItem("role");

  const roomPopupRef = useRef(null);
  const roomInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:4000/viewroom");
      setRoomsData(res.data);
      setFilteredRooms(res.data); // initialize filtered rooms
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Fetch user info
  const fetchUser = async () => {
    if (!guestemail) return;
    try {
      const res = await axios.get(
        `http://localhost:4000/user/email/${guestemail}`
      );
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchUser();
  }, []);

  // Delete room
  const deleteRoom = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`http://localhost:4000/deleteroom/${id}`);
        alert("Room deleted successfully");
        fetchRooms();
      } catch (err) {
        console.error("Error deleting room:", err);
      }
    }
  };

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        roomPopupRef.current &&
        !roomPopupRef.current.contains(e.target) &&
        !roomInputRef.current.contains(e.target)
      ) {
        setRoomPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roomValue = `${roomCount} Room(s), ${adults} Adults, ${children} Children`;

  const calculatePrice = (basePrice) => {
    let price = basePrice;
    if (roomCount > 1) price += price * 0.1 * (roomCount - 1);
    if (adults > 0) price += price * 0.15 * (adults - 1);
    if (children > 0) price += price * 0.15 * children;
    return price.toFixed(2);
  };

  // Filter available rooms based on check-in/out
  const handleSearch = async () => {
    const checkIn = document.getElementById("checkin").value;
    const checkOut = document.getElementById("checkout").value;

    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates");
      return;
    }

    try {
      // Fetch only available rooms from backend
      const res = await axios.post("http://localhost:4000/available", {
        checkIn,
        checkOut,
      });

      if (res.data.success) {
        const roomsWithPrice = res.data.rooms.map((room) => ({
          ...room,
          dynamicPrice: calculatePrice(room.price),
        }));
        setFilteredRooms(roomsWithPrice);
      } else {
        setFilteredRooms([]);
        alert(res.data.message || "No rooms available");
      }
    } catch (err) {
      console.error("Error fetching available rooms:", err);
    }
  };

  const goToBilling = (room) => {
    const checkIn = document.getElementById("checkin").value;
    const checkOut = document.getElementById("checkout").value;

    const guestEmail = guestemail;
    const guestName =
      user?.name || (guestEmail ? guestEmail.split("@")[0] : "Guest");

    if (!guestName || !guestEmail) {
      alert("Guest information missing. Please log in again.");
      return;
    }

    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates");
      return;
    }

    // Show alert with guest info
    const proceed = window.confirm(
      `Guest Name: ${guestName}\nGuest Email: ${guestEmail}\n\nProceed to billing?`
    );

    if (!proceed) return; // If admin clicks Cancel, stop navigation

    navigate("/billing", {
      state: {
        roomId: room._id,
        roomName: room.roomName,
        roomImage: room.image,
        roomDescription: room.description,
        checkIn,
        checkOut,
        roomCount,
        adults,
        children,
        dynamicPrice: calculatePrice(room.price),
        guestName,
        guestEmail,
        guestId: user?._id,
      },
    });
  };

  return (
    <>
      <Header />
      <div className="booking-box">
        <h2>Book Your Trip in Karachi</h2>

        {/* Date Pickers */}
        <div className="form-group">
          <label htmlFor="checkin">Check-in</label>
          <input type="date" id="checkin" />
        </div>
        <div className="form-group">
          <label htmlFor="checkout">Check-out</label>
          <input type="date" id="checkout" />
        </div>

        {/* Room Selector */}
        <div className="form-group room-select">
          <label>Guests & Rooms</label>
          <input
            type="text"
            value={roomValue}
            readOnly
            ref={roomInputRef}
            onClick={() => setRoomPopupOpen(!roomPopupOpen)}
          />
          {roomPopupOpen && (
            <div className="room-popup" ref={roomPopupRef}>
              <div>
                <span>Rooms</span>
                <div>
                  <button
                    onClick={() => setRoomCount(Math.max(1, roomCount - 1))}
                  >
                    -
                  </button>
                  <span>{roomCount}</span>
                  <button onClick={() => setRoomCount(roomCount + 1)}>+</button>
                </div>
              </div>
              <div>
                <span>Adults</span>
                <div>
                  <button onClick={() => setAdults(Math.max(1, adults - 1))}>
                    -
                  </button>
                  <span>{adults}</span>
                  <button onClick={() => setAdults(adults + 1)}>+</button>
                </div>
              </div>
              <div>
                <span>Children</span>
                <div>
                  <button onClick={() => setChildren(Math.max(0, children - 1))}>
                    -
                  </button>
                  <span>{children}</span>
                  <button onClick={() => setChildren(children + 1)}>+</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <button className="btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Rooms Section */}
      <section className="rooms">
        <h2>Available Rooms</h2>
        <div className="room-grid">
          {filteredRooms.length === 0 && (
            <p>No rooms available for selected dates.</p>
          )}
          {filteredRooms.map((room) => (
            <div
              className="room-card"
              key={room._id}
              onClick={() => goToBilling(room)}
              style={{ cursor: "pointer" }}
            >
              <img src={`Images/${room.image}`} alt={room.name} />
              <h3>{room.roomName}</h3>
              <h3>
                Price:{" "}
                <span style={{ textDecoration: "line-through", color: "red" }}>
                  PKR {room.price}
                </span>{" "}
                <span style={{ color: "green" }}>
                  PKR {room.dynamicPrice}
                </span>
              </h3>
              <p>{room.description}</p>
              <h3>{room.status}</h3>
              {role === "admin" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRoom(room._id);
                  }}
                  className="delete-btn"
                >
                  Delete Room
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

export default function Adminbookrooms() {
 const [roomPopupOpen, setRoomPopupOpen] = useState(false);
  const [roomCount, setRoomCount] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomsData, setRoomsData] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roomsOpen, setRoomsOpen] = useState(false);

  const [guestName, setGuestName] = useState("");   // new state
  const [guestEmail, setGuestEmail] = useState(""); // new state

  const adminEmail = localStorage.getItem("adminEmail");
  
  const navigate = useNavigate();

  const receptionistemail=localStorage.getItem("receptionistemail");
  const role=localStorage.getItem("role");
  if (
    (!adminEmail && !receptionistEmail) ||
    (role !== "admin" && role !== "receptionist")
  ) {
    return <Navigate to="/login" replace />;
  }


  const roomPopupRef = useRef(null);
  const roomInputRef = useRef(null);

  const roomValue = `${roomCount} Room(s), ${adults} Adults, ${children} Children`;

  // Fetch all rooms
  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:4000/viewroom");
      setRoomsData(res.data);
      setFilteredRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Close popup when clicking outside
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

  const calculatePrice = (basePrice) => {
    let price = basePrice;
    if (roomCount > 1) price += price * 0.1 * (roomCount - 1);
    if (adults > 0) price += price * 0.15 * (adults - 1);
    if (children > 0) price += price * 0.15 * children;
    return price.toFixed(2);
  };

  const handleSearch = async () => {
    const checkIn = document.getElementById("checkin").value;
    const checkOut = document.getElementById("checkout").value;

    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/available", { checkIn, checkOut });
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

  // Navigate to billing
  const goToBilling = (room) => {
    const checkIn = document.getElementById("checkin").value;
    const checkOut = document.getElementById("checkout").value;

    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates");
      return;
    }

    navigate("/billingpage", {
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
        guestName,   // pass guest name
        guestEmail,  // pass guest email
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="wrap">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>
                 <button
            className="close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            ✖
          </button>
          {role === "admin" && adminEmail && (
            <div className="brand">
            <div className="logo">SE</div>
            <div>
              <h2>Stayease {role}</h2>
              <p>{role} panel</p>
            </div>
          </div>
          )}
          {role === "receptioinst" && receptionistemail && (
            <div className="brand">
            <div className="logo">SE</div>
            <div>
              <h2>Stayease {role}</h2>
              <p>{role} panel</p>
            </div>
          </div>
          )}
         
         
          <nav className="nav">
            <a href="/admindashboard"><span className="icon">👥</span> Dashboard</a>
            <div className="dropdown">
              <button className="dropdown-btn" onClick={() => setRoomsOpen(!roomsOpen)}><span className="icon">📦</span> Rooms ▾</button>
                  {roomsOpen && (
                    <div className="dropdown-content">
                         <a href="/addroom">➕ Add Room</a>
                         <a href="/viewrooms">👁 View Rooms</a>
                         <a href="/bookrooms">📖 Book Rooms</a>
                    </div>
            )}
                 </div>
            
          
         {role === "admin" && (
            <a href="/adminuser"><span className="icon">👥</span> Users</a>
          )}
            <a href="/adminfeedbacks"><span className="icon">📊</span> Feedbacks</a>
            <a onClick={handleLogout}><span className="icon">🚪</span> Logout</a>
          </nav>
      </aside>

      {/* Main content */}
      <main className="main">
        <div className="topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="search">
            <input placeholder="Search bookings, users..." />
          </div>
        </div>

        {/* Booking Section */}
        <div className="booking-box">
          <h2>Book Your Trip</h2>

          {/* Guest Info */}
          <div className="form-group">
            <label>Guest Name</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter guest name"
            />
          </div>
          <div className="form-group">
            <label>Guest Email</label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Enter guest email"
            />
          </div>

          <div className="form-group">
            <label>Check-in</label>
            <input type="date" id="checkin" />
          </div>
          <div className="form-group">
            <label>Check-out</label>
            <input type="date" id="checkout" />
          </div>

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
                  <button onClick={() => setRoomCount(Math.max(1, roomCount - 1))}>-</button>
                  <span>{roomCount}</span>
                  <button onClick={() => setRoomCount(roomCount + 1)}>+</button>
                </div>
                <div>
                  <span>Adults</span>
                  <button onClick={() => setAdults(Math.max(1, adults - 1))}>-</button>
                  <span>{adults}</span>
                  <button onClick={() => setAdults(adults + 1)}>+</button>
                </div>
                <div>
                  <span>Children</span>
                  <button onClick={() => setChildren(Math.max(0, children))}>-</button>
                  <span>{children}</span>
                  <button onClick={() => setChildren(children + 1)}>+</button>
                </div>
              </div>
            )}
          </div>

          <button className="btn" onClick={handleSearch}>Search</button>
        </div>

        {/* Rooms Section */}
        <section className="rooms">
          <h2>Available Rooms</h2>
          <div className="room-grid">
            {filteredRooms.length === 0 && <p>No rooms available</p>}
            {filteredRooms.map((room) => (
              <div
                key={room._id}
                className="room-card"
                onClick={() => goToBilling(room)}
                style={{ cursor: "pointer" }}
              >
                <img src={`Images/${room.image}`} alt={room.roomName} />
                <h3>{room.roomName}</h3>
                <h3>
                  Price: <span style={{ textDecoration: "line-through", color: "red" }}>PKR {room.price}</span>{" "}
                  <span style={{ color: "green" }}>PKR {room.dynamicPrice}</span>
                </h3>
                <p>{room.description}</p>
                <h3>{room.status}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

  
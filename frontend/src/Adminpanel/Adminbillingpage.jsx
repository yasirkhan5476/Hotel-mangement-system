import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Adminbillingpage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminEmail = localStorage.getItem("adminEmail");
  const receptionistemail=localStorage.getItem("receptionistemail");
   const role=localStorage.getItem("role");
  if (
    (!adminEmail && !receptionistEmail) ||
    (role !== "admin" && role !== "receptionist")
  ) {
    return <Navigate to="/login" replace />;
  }


  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("role");
    navigate("/");
  };

  // ✅ Booking data passed from AdminBookRooms.js
  const bookingData = location.state;

  const handleConfirmBooking = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/adminbook",
        {
          guestName: bookingData.guestName,
          guestEmail: bookingData.guestEmail,
          roomId: bookingData.roomId,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          adults: bookingData.adults,
          children: bookingData.children,
          roomCount: bookingData.roomCount,
          dynamicPrice: bookingData.dynamicPrice,
          createdBy: adminEmail, // staff/receptionist making booking
          role: role, // admin / receptionist
        },
        { withCredentials: true }
      );

      if (res.data.booking) {
        alert(
          `✅ Booking confirmed for Guest: ${res.data.booking.guestName} (${res.data.booking.guestEmail})`
        );
        navigate("/invoice", { state: res.data.booking });
      } else {
        alert("❌ Failed to confirm booking");
      }
    } catch (err) {
      console.error("Error confirming booking:", err);
      alert("⚠ Something went wrong!");
    }
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
              <button className="dropdown-btn" onClick={() => setroomsOpen(!roomsOpen)}><span className="icon">📦</span> Rooms ▾</button>
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
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <div className="search">
            <input placeholder="Search bookings, users..." />
          </div>
        </div>

        <div className="billing-container">
          <h2>Booking Confirmation</h2>

          <div className="room-details card">
            <img src={`Images/${bookingData.roomImage}`} alt="room" />
            <h3>{bookingData.roomName}</h3>
            <p>{bookingData.roomDescription}</p>
            <p>
              <b>Check-In:</b> {bookingData.checkIn}
            </p>
            <p>
              <b>Check-Out:</b> {bookingData.checkOut}
            </p>
            <p>
              <b>Guests:</b> {bookingData.adults} Adults,{" "}
              {bookingData.children} Children
            </p>
            <p>
              <b>Rooms:</b> {bookingData.roomCount}
            </p>
            <p>
              <b>Total Price:</b>{" "}
              <span style={{ color: "green" }}>
                PKR {bookingData.dynamicPrice}
              </span>
            </p>
          </div>

          <div className="extra-fields card">
            <h3>Guest Information</h3>
            <label>👤 Guest Name</label>
            <input type="text" value={bookingData.guestName} readOnly />

            <label>📧 Email</label>
            <input type="text" value={bookingData.guestEmail} readOnly />
          </div>

          <button className="btn confirm-btn" onClick={handleConfirmBooking}>
            ✅ Confirm Booking
          </button>
        </div>
      </main>
    </div>
  );
}

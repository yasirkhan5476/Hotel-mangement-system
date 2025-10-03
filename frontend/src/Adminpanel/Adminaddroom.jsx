import React, { useState } from "react";
import "../CSS/style.css";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Adminaddroom() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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


  const [roomsOpen, setRoomsOpen] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    roomName: "",
    roomNumber: "",
    roomType: "Standard",
    price: "",
    description: "",
    image: null,
  });

  const [message, setMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("role");
    navigate("/");
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { roomName, roomNumber, roomType, price, description, image } = formData;

    // ✅ Validation for required fields
    if (!roomName || !roomNumber || !roomType || !price || !description) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    // ✅ Validation for image
    if (!image) {
      alert("⚠️ Please select an image!");
      return;
    }

    try {
      const data = new FormData();
      data.append("roomName", roomName);
      data.append("roomNumber", roomNumber);
      data.append("roomType", roomType);
      data.append("price", price);
      data.append("description", description);
      data.append("roomImage", image); // key should match backend

      const res = await axios.post("http://localhost:4000/rooms", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message);
      alert("✅ Room added successfully!");
      navigate("/viewrooms");

      // reset form
      setFormData({
        roomName: "",
        roomNumber: "",
        roomType: "Standard",
        price: "",
        description: "",
        image: null,
      });
    } catch (error) {
      console.error("Error adding room:", error);
      setMessage("❌ Failed to add room. Please try again.");
    }
  };

  return (
    <div className="wrap">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "active" : ""}`} id="sidebar">
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
            <div className="search">
              <input placeholder="Search bookings, users..." />
            </div>
          </div>
          <div className="profile">
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "700" }}>{role}</div>
              <small style={{ color: "var(--muted)" }}>{adminEmail}</small>
            </div>
            <div className="avatar"></div>
          </div>
        </div>

        {/* Add Room Form */}
        <section className="content">
          <h2 className="form-title">➕ Add New Room</h2>
          {message && <p className="form-message">{message}</p>}
          <form onSubmit={handleSubmit} className="room-form">
            <div className="form-group">
              <label>Room Name</label>
              <input type="text" name="roomName" value={formData.roomName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Room Number</label>
              <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Room Type</label>
              <select name="roomType" value={formData.roomType} onChange={handleChange}>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Room Image</label>
              <input type="file" name="image" accept="image/*" onChange={handleChange} />
            </div>
            <button type="submit" className="buttons">Add Room</button>
          </form>
        </section>
      </main>
    </div>
  );
}

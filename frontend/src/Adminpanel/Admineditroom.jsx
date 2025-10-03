import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export default function Admineditroom() {
 const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminEmail = localStorage.getItem("adminEmail");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
 const receptionistemail=localStorage.getItem("receptionistemail");

  if (
    (!adminEmail && !receptionistEmail) ||
    (role !== "admin" && role !== "receptionist")
  ) {
    return <Navigate to="/login" replace />;
  }


  // Dropdown for Rooms
  const [roomsOpen, setRoomsOpen] = useState(false);
  const {id}=useParams();

  // Form States
  const [formData, setFormData] = useState({
    roomName:"",
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

  // handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  useEffect(()=>{
    let fetchroom=async()=>{
      try{
      const res = await axios.get(`http://localhost:4000/editrooms/${id}`);

        console.log("fetch room :",res.data);
        setFormData({
          roomName:res.data.roomName,
          roomNumber: res.data.roomNumber,
          roomType: res.data.roomType,
          price: res.data.price,
          description: res.data.description,
          image: null,
          existingImage: res.data.image 
        })
      }catch(error){
          console.log("Error fetching room:", error);
      }
    };
    fetchroom();
  },[id]);

  // handle form submit
// handle form submit
const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Basic validation for required fields
  if (!formData.roomName || !formData.roomNumber || !formData.price || !formData.description) {
    alert("⚠️ Please fill all fields!");
    return;
  }


  if (!formData.image && !formData.existingImage) {
    alert("⚠️ Please upload an image!");
    return;
  }

  try {
    const data = new FormData();
    data.append("roomName", formData.roomName);
    data.append("roomNumber", formData.roomNumber);
    data.append("roomType", formData.roomType);
    data.append("price", formData.price);
    data.append("description", formData.description);

    // ✅ Only append image if a new one is uploaded
    if (formData.image) {
      data.append("roomImage", formData.image);
    }

    const res = await axios.put(
      `http://localhost:4000/updateroom/${id}`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setMessage(res.data.message);
    navigate("/viewrooms");

  } catch (error) {
    console.log("Error updating room:", error);
    setMessage("Failed to update room. Please try again.");
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
          <div
            style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}
          >
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>

            <div className="search">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                style={{ opacity: ".6" }}
              >
                <path
                  d="M21 21l-4.35-4.35"
                  stroke="#0f172a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="11.5"
                  cy="11.5"
                  r="5.5"
                  stroke="#0f172a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
              <input
                type="text"
                name="roomName"
                value={formData.roomName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Room Number</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Room Type</label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
              >
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
              <div className="form-group">
              <label>Current Image</label>
             {formData.existingImage && (<img src={`/Images/${formData.existingImage}`} alt="room" style={{ width: "200px", height: "200px", objectFit: "cover" }}  />)}

            </div>

            <div className="form-group">
              <label>Room Image</label>
              <input type="file" name="image" accept="image/*" onChange={handleChange}
              />
            </div>

            <button type="submit" className="buttons">
             Update Room
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

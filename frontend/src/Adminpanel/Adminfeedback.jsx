import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";

export default function AdminFeedback() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roomsOpen, setRoomsOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  const navigate = useNavigate();
  const adminEmail = localStorage.getItem("adminEmail");
 const receptionistemail=localStorage.getItem("receptionistemail");
  const role=localStorage.getItem("role");
  if (
    (!adminEmail && !receptionistEmail) ||
    (role !== "admin" && role !== "receptionist")
  ) {
    return <Navigate to="/login" replace />;
  }


  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("role");
    navigate("/");
  };

  // ✅ Fetch feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("http://localhost:4000/fetchfeedbacks");
        setFeedbacks(res.data);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      }
    };
    fetchFeedbacks();
  }, []);

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

      {/* Main */}
      <main className="main">
        <div className="topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <div className="search">
            <input placeholder="Search feedbacks..." />
          </div>
        </div>

        <div className="billing-container">
          <h2>📋 Guest Feedbacks</h2>

          {feedbacks.length === 0 ? (
            <p>No feedbacks yet</p>
          ) : (
            <div className="feedback-list">
              {feedbacks.map((fb) => (
                <div key={fb._id} className="card feedback-card">
                  <h3>
                    👤 {fb.guest?.username || "Unknown"} (
                    {fb.guest?.email || "No Email"})
                  </h3>
                  <p>
                    ⭐ <b>{fb.rating}</b>/5
                  </p>
                  <p>{fb.comments}</p>
                  {fb.room && (
                    <p>
                      🏨 Room {fb.room.roomNumber} ({fb.room.roomType})
                    </p>
                  )}
                  <small>
                    Submitted on {new Date(fb.createdAt).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "../CSS/style.css"
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";


export default function Admindashboard() {
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

   
const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:4000/admin/dashboard-stats")
      .then(res => {
        if(res.data.success){
          setStats(res.data.stats);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleCardClick = (page) => {
    navigate(page); // redirect to desired page
  }

   const [roomsOpen,setroomsOpen]=useState(false);
    if (role !== "admin" || !adminEmail) {
    return <Navigate to="/login" replace />;
    
  }

  const handleLogout = () => {

    localStorage.removeItem("adminEmail");
     localStorage.removeItem("receptionistemail");
    localStorage.removeItem("role");
    

    navigate("/");
  };

  return (
    <>


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

          <div className="divider"></div>

          <div>
            <h4 style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "8px" }}>Quick actions</h4>
            <a href="#" className="quick-btn">+ New</a>
            <a href="#" className="quick-btn export">Export</a>
          </div>
        </aside>

        {/* Main content */}
        <main className="main">
          <div className="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
              <button
                className="hamburger"
                onClick={() => setSidebarOpen(true)}
              >
                ☰
              </button>

              <div className="search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: ".6" }}>
                  <path d="M21 21l-4.35-4.35" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11.5" cy="11.5" r="5.5" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

          {/* Stat cards */}
          <h2 style={{marginBottom:"20px"}}>Reports</h2>
         <div className="grid">
          
      <div className="card" onClick={() => handleCardClick("/adminuser")} style={{cursor:"pointer"}}>
        <h3>Total Users</h3>
        <div className="stat">{stats.totalUsers || 0}</div>
      </div>

      <div className="card" onClick={() => handleCardClick("/viewrooms")} style={{cursor:"pointer"}}>
        <h3>Total Bookings</h3>
        <div className="stat">{stats.totalBookings || 0}</div>
      </div>

      <div className="card" onClick={() => handleCardClick("/bookings-revenue")} style={{cursor:"pointer"}}>
        <h3>Total Revenue</h3>
        <div className="stat">PKR {stats.totalRevenue || 0}</div>
      </div>

      <div className="card" onClick={() => handleCardClick("/adminfeedbacks")} style={{cursor:"pointer"}}>
        <h3>Total Feedbacks</h3>
        <div className="stat">{stats.totalFeedbacks || 0}</div>
      </div>
    </div>

        
        </main>
      </div>
    </>
  );
}

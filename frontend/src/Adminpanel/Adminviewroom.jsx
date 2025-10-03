import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Adminviewroom() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const adminEmail = localStorage.getItem("adminEmail")

  const navigate = useNavigate()
  const [roomsOpen, setRoomsOpen] = useState(false) 
  const [search,setSearch]=useState("");
  const [rooms, setRooms] = useState([])
   const receptionistemail=localStorage.getItem("receptionistemail");
    const role=localStorage.getItem("role");
  if (
    (!adminEmail && !receptionistEmail) ||
    (role !== "admin" && role !== "receptionist")
  ) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("adminEmail")
    localStorage.removeItem("role")
    navigate("/")
  }

  useEffect(() => {
     fetchRooms();
   }, []);


    const fetchRooms = async () => {
     try {
       const res = await axios.get("http://localhost:4000/viewroom");
       setRooms(res.data); // store fetched rooms
      } catch (error) {
         console.error("Error fetching rooms:", error);
     }
   };

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
  const filteredRooms = rooms.filter((room) =>
    room.roomName.toLowerCase().includes(search.toLowerCase()) ||
    room.roomType.toLowerCase().includes(search.toLowerCase()) ||
    room.roomNumber.toString().includes(search) ||
    room.description.toLowerCase().includes(search.toLowerCase())
  );
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
              <button className="hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
              <div className="search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: ".6" }}>
                  <path d="M21 21l-4.35-4.35" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11.5" cy="11.5" r="5.5" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                
                <input placeholder="Search rooms"  value={search} onChange={(e)=>setSearch(e.target.value)}/>
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


          {/* Rooms list */}
          <section className="content" style={{ display: "grid",flex:"1", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
             {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <div key={room._id} className="room-card card" 
                  onClick={() => navigate(`/editroom/${room._id}`)} 
                  style={{ cursor: "pointer" }}
                >
                  <img 
                    src={`Images/${room.image}`} 
                    alt={room.name} 
                    style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }} 
                  />
                  <div className="roomsdetails">
                    <div className="roominfo">
                      <h3>{room.roomName}</h3>
                      <p>{room.description}</p>
                      <p><b>Room Price:</b> ${room.price}</p>
                      <p><b>Room Type:</b> {room.roomType}</p> 
                      <p><b>Room Number:</b> {room.roomNumber}</p>
                    </div>
                    <div className="roomavail">
                      <p>{room.status}</p>
                      <button onClick={(e)=>{ e.stopPropagation(); deleteRoom(room._id); }} >Delete</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ gridColumn: "1/-1", textAlign: "center" }}>No rooms found</p>
            )}
          </section>
        </main>
      </div>
    </>
  )
}

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import "../CSS/style.css"


export default function Adminuserdetail() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminEmail = localStorage.getItem("adminEmail");
  const navigate = useNavigate();
  const { id } = useParams();
  const [roomsOpen,setroomsOpen]=useState(false);

  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
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

  useEffect(() => {
    axios
      .get(`http://localhost:4000/user/${id}`)
      .then((res) => {
        setUser(res.data);
        setSelectedRole(res.data.role);
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, [id]);

const handleRoleUpdate = () => {
  axios
    .put(`http://localhost:4000/user/${id}`, { role: selectedRole })
    .then(() => {
      alert("User role updated successfully!");
      navigate("/adminuser");
    })
    .catch((error) => console.error("Error updating role:", error));
};

  if (!user) {
    return <p style={{ padding: "20px" }}>Loading user details...</p>;
  }

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
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>
          </div>

          <div className="profile">
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "700" }}>{role}</div>
              <small style={{ color: "var(--muted)" }}>{adminEmail}</small>
            </div>
            <div className="avatar"></div>
          </div>
        </div>

        {/* User details */}
        <section className="content">
          <h2>User Details / Update Role</h2>
          <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
            <p style={{margin:"20px"}}><strong>Username:</strong> {user.username}</p>
            <p style={{margin:"20px"}}><strong>Email:</strong> {user.email}</p>
            <p style={{margin:"20px"}}><strong>Current Role:</strong> {user.role}</p>

            <label style={{margin:"20px"}}>
              Update Role:{" "}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="admin">admin</option>
                <option value="receptionist">receptionist</option>
                <option value="guest">guest</option>
              </select>
            </label>

            <br /><br />
            <button onClick={handleRoleUpdate} className="buttons" style={{ padding: "8px 16px" ,margin:"20px" }}>
              Save Changes
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

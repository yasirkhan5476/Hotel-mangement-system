import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import "../CSS/style.css"

export default function Adminuser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminEmail = localStorage.getItem("adminEmail");
  const navigate = useNavigate();
  const [roomsOpen,setroomsOpen]=useState(false);
 const receptionistemail=localStorage.getItem("receptionistemail");
  const role=localStorage.getItem("role");
  if (
    (!adminEmail && !receptionistEmail) ||
    (role !== "admin" && role !== "receptionist")
  ) {
    return <Navigate to="/login" replace />;
  }

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("role");
    navigate("/");
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Filter users for search
  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  
 const handleUserClick = (id) => {
  navigate(`/adminuserdetails/${id}`);
};
const handleDeleteUser = async (id) => {
  if (window.confirm("Are you sure you want to delete this user?")) {
    try {
      await axios.delete(`http://localhost:4000/user/${id}`);
      setUsers(users.filter(user => user._id !== id));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  }
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
          <h4 style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "8px" }}>
            Quick actions
          </h4>
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
            <div className="search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: ".6" }}>
                <path d="M21 21l-4.35-4.35" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="11.5" cy="11.5" r="5.5" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                placeholder="Search users..."
                
              />
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

        {/* Users table */}
        <section className="content">
          <h2>Users List / Click to View Details/click to gove permission to the user</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={index}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleUserClick(user._id)}
                  >
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td><button onClick={(e)=>{
                      e.stopPropagation();
                      handleDeleteUser(user._id);
                    }}style={{padding: "10px",fontSize: "16px", background: "rgb(47, 47, 47)",  color: "white",border: "none",borderRadius: "8px",cursor: "pointer", width: "100px" }} className='buttons'>Delete</button></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

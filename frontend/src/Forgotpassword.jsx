
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

 function Forgotpassword() {
    const { email } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/forgotpassword", {
        email: decodeURIComponent(email),
        newPassword
      });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data || "Error updating password");
    }
  };

  return (
    <>
      <div className="outer">
        <div className="form">
          <h1>Reset Password for {decodeURIComponent(email)}</h1>
          <form onSubmit={handleChangePassword}>
           <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

             <button type="submit" className="buttons">Change Password</button>
          </form>
        </div>
      </div>
    </>
  );
}
export default Forgotpassword;

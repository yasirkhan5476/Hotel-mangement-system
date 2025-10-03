import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formdata);
    try {
      const response = await axios.post("http://localhost:4000/login", formdata);
      let {id, role, email, message } = response.data;
      setMessage(message);
      

      if (role === "admin") {
        localStorage.setItem("role",role);   
        localStorage.setItem("adminEmail", email);
        localStorage.setItem("userid", id);
        navigate("/");
      } else  if (role == "receptionist") {
        localStorage.setItem("role",role);   
        localStorage.setItem("receptionistemail", email);
        localStorage.setItem("userid", id);
        navigate("/");
      }else if(role=="guest"){
         localStorage.setItem("role",role);   
         localStorage.setItem("guestpanel", email);
         localStorage.setItem("userid", id);
        navigate("/");
      }
    } catch (error) {
      setMessage(error.response ? error.response.data : "Login failed");
    }
  };
   const handleForgotPassword = () => {
    if (!formdata.email) {
      alert("Please enter your email first");
      return;
    }
    navigate(`/forgotpassword/${encodeURIComponent(formdata.email)}`);
  };

  return (
    <>
      <div className="outer">
        <div className="form">
          <h1>Welcome to Stayease</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" placeholder="Enter your email"  value={formdata.email}  onChange={handleChange} />

            <label htmlFor="password">Password</label>
            <input type="password"  id="password"  name="password"  placeholder="Enter your password"  value={formdata.password}  onChange={handleChange}/>

            <div className="links">
             <a type="button" onClick={handleForgotPassword}>Forgot password?</a>
              <a href="/signin">Sign up</a>
            </div>

            <input type="submit" value="login" className="button" />
          </form>
          {message && <p className='redder'>{message}</p>}
        </div>
      </div>
    </>
  );
}

export default Login;

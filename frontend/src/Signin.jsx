import React, { useState } from 'react';
import '../src/CSS/style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signin() {
  let [formdata, setformdata] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handlechange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/register", formdata);
      setMessage(response.data);
      navigate('/');
      setformdata({
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data);
      } else {
        setMessage("Error registering user");
      }
    }
  };

  return (
    <div className="outer">
      <div className="form">
        <h1>Welcome to Stayease</h1>
        <form onSubmit={handlesubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your Username"
            value={formdata.username}
            onChange={handlechange}
          />

          <label htmlFor="email">Email</label>
          <input type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={formdata.email}
            onChange={handlechange}
          />

          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" placeholder="Enter your password" value={formdata.password} onChange={handlechange}
          />
          <div className="links">
             <a type="button" href='/'>Already have an Account!</a>
             
            </div>
          <input type="submit" value="Register" className="button" />
        </form>
        <p className="redder">{message}</p>
      </div>

    </div>
  );
}
export default Signin;


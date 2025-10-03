import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Feedbacks() {
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userid"); 
  const handleSubmit = async () => {
    try {
     await axios.post("http://localhost:4000/feedbacks", {
  userId,  
  rating,
  comments
});;

      setRating(5);
      setComments("");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("⚠ Failed to submit feedback");
    }
  };

  return (
    <>
      <Header />
      <div className="feedback-form">
        <h3>Leave Feedback</h3>

        <label>Rating (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <label>Comments</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />

        <button onClick={handleSubmit}>Submit</button>

        <style>
          {`
            .feedback-form {
              max-width: 400px;
              margin: 20px auto;
              padding: 20px;
              background: #f7f9fc;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .feedback-form h3 {
              text-align: center;
              color: #333;
              margin-bottom: 15px;
            }

            .feedback-form label {
              display: block;
              margin-top: 10px;
              margin-bottom: 5px;
              font-weight: 600;
              color: #555;
            }

            .feedback-form input[type="number"],
            .feedback-form textarea {
              width: 100%;
              padding: 8px 10px;
              border: 1px solid #ccc;
              border-radius: 5px;
              outline: none;
              transition: border-color 0.3s;
              font-size: 14px;
            }

            .feedback-form input[type="number"]:focus,
            .feedback-form textarea:focus {
              border-color: #4f46e5;
            }

            .feedback-form textarea {
              resize: vertical;
              min-height: 80px;
            }

            .feedback-form button {
              margin-top: 15px;
              width: 100%;
              padding: 10px;
              background-color: #4f46e5;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-weight: bold;
              font-size: 16px;
              transition: background-color 0.3s;
            }

            .feedback-form button:hover {
              background-color: #3730a3;
            }
          `}
        </style>
      </div>
      <Footer />
    </>
  );
}

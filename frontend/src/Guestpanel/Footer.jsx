import React from "react";
import "../CSS/style.css";

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-section contact">
          <h3>Contact US</h3>
          <p>📍 Address</p>
          <p>📞 +01 1234569540</p>
          <p>✉️ demo@gmail.com</p>
        </div>

        <div className="footer-section links">
          <h3>Menu Link</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Our Room</a></li>
            <li><a href="#">Gallery</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section newsletter">
          <h3>News Letter</h3>
          <input type="email" placeholder="Enter your email" />
          <button>SUBSCRIBE</button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 All Rights Reserved. Design by Stayease team</p>
        <p>Distributed by Yasir Idrees Khan</p>
      </div>
    </footer>
  );
}

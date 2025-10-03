import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Confirmation() {
  const { state } = useLocation(); // booking data from Billing.js
  const navigate = useNavigate();

  if (!state) {
    return (
      <>
        <Header />
        <div className="confirmation-page">
          <h2>No booking details found</h2>
          <button onClick={() => navigate("/")}>Go Back</button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="confirmation-page">
        <div className="confirmation-card">
          <h2>🎉 Booking Confirmed!</h2>
          <p className="success-text">Thank you, {state.guestName}. Your booking has been successfully placed.</p>
          
          {/* Booking Summary */}
          <div className="summary-grid">
            {/* Left - Room Info */}
            <div className="room-summary">
              <img src={`Images/${state.roomImage}`} alt={state.roomName} />
              <h3>{state.roomName}</h3>
              <p>{state.roomDescription}</p>
              <div className="price-box">
                <p><strong>Total: PKR {state.dynamicPrice}</strong></p>
              </div>
            </div>

            {/* Right - Guest + Booking Info */}
            <div className="guest-summary">
              <h3>Guest Information</h3>
              <div className="guest-info">
                {state.guestImage && (
                  <img src={`Images/${state.guestImage}`} alt="guest" />
                )}
                <div>
                  <p><strong>{state.guestName}</strong></p>
                  <p>{state.guestemail}</p>
                </div>
              </div>

              <h3>Booking Details</h3>
              <p><strong>Check-In:</strong> {state.checkIn}</p>
              <p><strong>Check-Out:</strong> {state.checkOut}</p>
              <p><strong>Guests:</strong> {state.adults} Adults, {state.children} Children</p>
              <p><strong>Rooms:</strong> {state.roomCount}</p>
              <p><strong>Booking ID:</strong> {state._id}</p>
            </div>
          </div>

          {/* Button */}
          <button  style={{background:"blue"}}onClick={() => navigate("/")} className="buttons">
            Back to Home
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

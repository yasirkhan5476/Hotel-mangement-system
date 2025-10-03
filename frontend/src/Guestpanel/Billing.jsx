import { useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import axios from "axios";

export default function Billing() {
  const { state } = useLocation();
  const navigate = useNavigate();
  

  const handleBooking = async () => {
    try {
      const response = await axios.post("http://localhost:4000/book", {
        roomId: state.roomId,
        roomName: state.roomName,
        guestName: state.guestName,
        guestEmail: state.guestemail,
        guestImage: state.guestImage,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        adults: state.adults,
        children: state.children,
        roomCount: state.roomCount,
        dynamicPrice: state.dynamicPrice,
      });

      alert(response.data.message);
      navigate("/confirm", { state: response.data.booking });

    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  return (
    <>
      <Header />
      <div className="billing-page">
        {/* Left Section - Room Info */}
        <div className="left-section">
          <img src={`Images/${state.roomImage}`} alt={state.roomName} />
          <h3>{state.roomName}</h3>
          <p>{state.roomDescription}</p>
          <div className="price-box">
            <p ><strong>PKR {state.dynamicPrice}</strong></p>
          </div>
        </div>

        {/* Right Section - Guest + Booking Details */}
        <div className="right-section">
          <h3>Guest Information</h3>
          <div className="guest-info">
            {state.guestImage && <img src={`Images/${state.guestImage}`} alt="guest" />}
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

          {/* Confirm Booking Button */}
          <button style={{background:"blue"}}onClick={handleBooking} className="buttons">
            Confirm Booking
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

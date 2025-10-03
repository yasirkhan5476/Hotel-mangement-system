import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./Footer";
import Header from "./Header";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Invoicepage() {
  const [bookings, setBookings] = useState([]);
  const guestEmail = localStorage.getItem("guestpanel");

  useEffect(() => {
  if (guestEmail) {
    axios
      .get(`http://localhost:4000/invoice/${encodeURIComponent(guestEmail)}`)
      .then((res) => {
        if (res.data.success) {
          setBookings(res.data.bookings);
        } else {
          console.log("No bookings found");
        }
      })
      .catch((err) => console.log("Error fetching bookings:", err));
  }
}, [guestEmail]);


  const downloadPDF = (id) => {
    const invoiceElement = document.getElementById(`invoice-${id}`);
    html2canvas(invoiceElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice-${id}.pdf`);
    });
  };

  if (!bookings || bookings.length === 0) {
    return (
      <>
        <Header />
        <p className="no-bookings" style={{ textAlign: "center", marginTop: "50px" }}>
          No bookings found.
        </p>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="invoice-page" style={{ padding: "20px" }}>
        {bookings.map((booking) => (
          <div
            key={booking._id}
            id={`invoice-${booking._id}`}
            className="invoice-container invoice-card"
            style={{
              maxWidth: "800px",
              margin: "20px auto",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "15px",
              backgroundColor: "#f9f9f9",
            }}
          >
            {/* Header */}
            <div className="invoice-header" style={{ textAlign: "center", marginBottom: "20px" }}>
              <h1>Hotel Invoice</h1>
              <p>Invoice #{booking._id.slice(-6)}</p>
            </div>

            {/* Guest Details */}
            <div className="section" style={{ marginBottom: "20px" }}>
              <h2>Guest Details</h2>
              <p><strong>Name:</strong> {booking.guestName}</p>
              <p><strong>Email:</strong> {booking.guestEmail}</p>
            </div>

            {/* Booking Details */}
            <div className="section" style={{ marginBottom: "20px" }}>
              <h2>Booking Details</h2>
              <p><strong>Room Number:</strong> {booking.room?.roomNumber || "N/A"}</p>
              <p><strong>Room Type:</strong> {booking.room?.roomType || "N/A"}</p>
              <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>

              <img
                src={booking.room?.image ? `/Images/${booking.room.image}` : "/Images/default.png"}
                alt={booking.room?.roomType || "Room"}
                style={{ width: "200px", borderRadius: "10px", margin: "10px 0" }}
              />

              <p><strong>Adults:</strong> {booking.adults}</p>
              <p><strong>Children:</strong> {booking.children}</p>
              <p><strong>Rooms Booked:</strong> {booking.roomCount}</p>
            </div>

            {/* Payment */}
            <div className="section payment" style={{ marginBottom: "20px" }}>
              <h2>Payment</h2>
              <p>
                <strong>Price per Night:</strong> ${booking.dynamicPrice || booking.room?.price || 0}
              </p>
              <p>
                <strong>Total Amount:</strong> ${(booking.dynamicPrice || booking.room?.price || 0) * booking.roomCount}
              </p>
            </div>

            {/* Footer */}
            <div className="invoice-footer" style={{ textAlign: "center", marginBottom: "15px" }}>
              <p>Thank you for choosing our hotel!</p>
              <p>Generated on {new Date().toLocaleString()}</p>
            </div>

            {/* Download Button */}
            <div style={{ textAlign: "center" }}>
              <button
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  borderRadius: "20px",
                  border: "none",
                  width: "150px",
                  background: "black",
                  color: "white",
                }}
                onClick={() => downloadPDF(booking._id)}
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}

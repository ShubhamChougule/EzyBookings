import React, { useState } from "react";
import moment from "moment";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  cancelBooking,
  getBookingByConfirmationCode,
} from "../utils/ApiFunctions";

const FindBooking = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    id: "",
    bookingConfirmationCode: "",
    room: { id: "", roomType: "" },
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
    guestName: "",
    guestEmail: "",
    numOfAdults: "",
    numOfChildren: "",
    totalNumOfGuests: "",
  });

  const emptyBookingInfo = {
    id: "",
    bookingConfirmationCode: "",
    room: { id: "", roomType: "" },
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
    guestName: "",
    guestEmail: "",
    numOfAdults: "",
    numOfChildren: "",
    totalNumOfGuests: "",
  };
  const [isDeleted, setIsDeleted] = useState(false);

  const handleInputChange = (event) => {
    setConfirmationCode(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const data = await getBookingByConfirmationCode(confirmationCode);
      setBookingInfo(data);
      setError(null);
    } catch (error) {
      setBookingInfo(emptyBookingInfo);
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError(error.message);
      }
    }

    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleBookingCancellation = async (bookingId) => {
    try {
      await cancelBooking(bookingInfo.id);
      setIsDeleted(true);
      setSuccessMessage("Booking has been cancelled successfully!");
      setBookingInfo(emptyBookingInfo);
      setConfirmationCode("");
      setError(null);
    } catch (error) {
      setError(error.message);
    }
    setTimeout(() => {
      setSuccessMessage("");
      setIsDeleted(false);
    }, 2000);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title and date
    doc.setFontSize(18);
    doc.text("Booking Receipt", 14, 22);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    // Add table
    doc.autoTable({
      startY: 40,
      head: [["Detail", "Information"]],
      body: [
        ["Confirmation Code", bookingInfo.bookingConfirmationCode],
        ["Room Number", bookingInfo.room.id],
        ["Room Type", bookingInfo.room.roomType],
        [
          "Check-in Date",
          moment(bookingInfo.checkInDate).format("MMM Do, YYYY"),
        ],
        [
          "Check-out Date",
          moment(bookingInfo.checkOutDate).format("MMM Do, YYYY"),
        ],
        ["Full Name", bookingInfo.guestName],
        ["Email Address", bookingInfo.guestEmail],
        ["Adults", bookingInfo.numOfAdults],
        ["Children", bookingInfo.numOfChildren],
        ["Total Guests", bookingInfo.totalNumOfGuests],
      ],
      styles: { fontSize: 12 },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      bodyStyles: { fillColor: [245, 245, 245] },
    });

    // Save the PDF
    doc.save("receipt.pdf");
  };

  return (
    <>
      <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-center mb-4">Find My Booking</h2>
        <form onSubmit={handleFormSubmit} className="col-md-6">
          <div className="input-group mb-3">
            <input
              className="form-control"
              type="text"
              id="confirmationCode"
              name="confirmationCode"
              value={confirmationCode}
              onChange={handleInputChange}
              placeholder="Enter the booking confirmation code"
            />
            <button type="submit" className="btn btn-hotel input-group-text">
              Find booking
            </button>
          </div>
        </form>

        {isLoading ? (
          <div>Finding your booking...</div>
        ) : error ? (
          <div>
            {error && <p className="alert alert-danger">Error: {error}</p>}
          </div>
        ) : bookingInfo.bookingConfirmationCode ? (
          <div className="col-md-6 mt-4 mb-5">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h4 className="card-title mb-0">Booking Information</h4>
              </div>
              <div className="card-body">
                <p className="text-success">
                  <strong>Confirmation Code:</strong>{" "}
                  {bookingInfo.bookingConfirmationCode}
                </p>
                <p>
                  <strong>Room Number:</strong> {bookingInfo.room.id}
                </p>
                <p>
                  <strong>Room Type:</strong> {bookingInfo.room.roomType}
                </p>
                <p>
                  <strong>Check-in Date:</strong>{" "}
                  {moment(bookingInfo.checkInDate).format("MMM Do, YYYY")}
                </p>
                <p>
                  <strong>Check-out Date:</strong>{" "}
                  {moment(bookingInfo.checkOutDate).format("MMM Do, YYYY")}
                </p>
                <p>
                  <strong>Full Name:</strong> {bookingInfo.guestName}
                </p>
                <p>
                  <strong>Email Address:</strong> {bookingInfo.guestEmail}
                </p>
                <p>
                  <strong>Adults:</strong> {bookingInfo.numOfAdults}
                </p>
                <p>
                  <strong>Children:</strong> {bookingInfo.numOfChildren}
                </p>
                <p>
                  <strong>Total Guests:</strong> {bookingInfo.totalNumOfGuests}
                </p>

                {!isDeleted && (
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      onClick={() => handleBookingCancellation(bookingInfo.id)}
                      className="btn btn-danger"
                    >
                      Cancel Booking
                    </button>
                    <button onClick={generatePDF} className="btn btn-primary">
                      Download as PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>Find booking...</div>
        )}

        {isDeleted && (
          <div className="alert alert-success mt-3 fade show">
            {successMessage}
          </div>
        )}
      </div>
    </>
  );
};

export default FindBooking;

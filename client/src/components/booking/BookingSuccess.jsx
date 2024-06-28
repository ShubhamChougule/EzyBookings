import React from "react";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Header from "../common/Header";

const BookingSuccess = () => {
  const location = useLocation();
  const message = location.state?.message;
  const error = location.state?.error;

  const confirmationCode = message ? message.split(":")[1].trim() : null;

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
        ["Message", message],
        ["Confirmation Code", confirmationCode],
      ],
      styles: { fontSize: 12 },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      bodyStyles: { fillColor: [245, 245, 245] },
    });

    // Save the PDF
    doc.save("receipt.pdf");
  };

  return (
    <div className="container">
      <Header title="Booking Success" />
      <div className="mt-5">
        {message ? (
          <div className="text-center">
            <h3 className="text-success">Booking Success!</h3>
            <p className="text-success">Room booked successfully!</p>
            <p className="text-success">
              Your booking confirmation code is:{" "}
              <strong>{confirmationCode}</strong>
            </p>
            <div className="mt-4 card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h4 className="card-title mb-0">Receipt</h4>
              </div>
              <div className="card-body">
                <p>Thank you for your booking!</p>
                <p>
                  <strong>Booking Details:</strong>
                </p>
                <p>{message}</p>
                <button onClick={generatePDF} className="btn btn-primary mt-3">
                  Download Receipt as PDF
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-danger">Error Booking Room!</h3>
            <p className="text-danger">{error}</p>
            <div className="mt-4 card shadow-sm">
              <div className="card-header bg-danger text-white">
                <h4 className="card-title mb-0">Error Details</h4>
              </div>
              <div className="card-body">
                <p>There was an issue with your booking:</p>
                <p>{error}</p>
                <button onClick={generatePDF} className="btn btn-primary mt-3">
                  Download Error Details as PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSuccess;

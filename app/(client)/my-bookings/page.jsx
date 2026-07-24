"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/lib/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Info, FileDown, Ban } from "lucide-react";

export default function MyBookingsPage() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingStatus: "CANCELLED" }),
      });

      if (res.ok) {
        alert("Booking cancelled successfully!");
        fetchBookings(); // Refresh the list
      } else {
        const err = await res.json();
        alert(err.error || "Could not cancel booking.");
      }
    } catch (err) {
      console.error(err);
      alert("Error cancelling booking.");
    }
  };

  const handlePrintReceipt = (booking) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${booking.bookingNumber}</title>
          <style>
            body { font-family: 'Poppins', sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #EA580C; padding-bottom: 20px; }
            .header h1 { color: #EA580C; margin: 0; }
            .details { margin-top: 30px; line-height: 1.8; }
            .details table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .details th, .details td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .details th { bg-color: #FFF8E7; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 20px; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <h1>श्री साई विठ्ठल भक्त निवास</h1>
            <p>LIC Road, Opposite Vitthal Rukmini Bhakt Niwas, Pandharpur</p>
            <p>Phone: +91 98765 43210 | info@saivitthalbhaktniwas.com</p>
          </div>
          <div class="details">
            <h2>Booking Invoice / पावती</h2>
            <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
            <p><strong>Date Generated:</strong> ${new Date().toLocaleDateString()}</p>
            
            <table>
              <tr>
                <th>Detail</th>
                <th>Information</th>
              </tr>
              <tr>
                <td>Room Details</td>
                <td>Room ${booking.room.roomNumber} (${booking.room.roomType})</td>
              </tr>
              <tr>
                <td>Check-in Date</td>
                <td>${new Date(booking.checkIn).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td>Check-out Date</td>
                <td>${new Date(booking.checkOut).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td>Guests</td>
                <td>${booking.adults} Adults, ${booking.children} Children</td>
              </tr>
              <tr>
                <td>Total Price</td>
                <td><strong>₹${booking.amount}</strong></td>
              </tr>
              <tr>
                <td>Booking Status</td>
                <td>${booking.bookingStatus}</td>
              </tr>
              <tr>
                <td>Payment Status</td>
                <td>${booking.paymentStatus}</td>
              </tr>
            </table>
          </div>
          <div class="footer">
            <p>Thank you for staying at Shri Sai Vitthal Bhakt Niwas. Have a blessed pilgrimage!</p>
            <p>जय हरी विठ्ठल | श्री स्वामी समर्थ</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "CANCELLED": return "text-red-600 bg-red-50 border-red-200";
      case "CHECKED_IN": return "text-blue-600 bg-blue-50 border-blue-200";
      case "CHECKED_OUT": return "text-gray-500 bg-gray-100 border-gray-200";
      default: return "text-amber-600 bg-amber-50 border-amber-200";
    }
  };

  return (
    <div className="bg-[#FFF8E7] min-h-screen py-24 text-[#374151]">
      <div className="mx-auto max-w-4xl px-6">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-serif text-3xl font-bold text-[#EA580C] sm:text-4xl">
            {t("nav.myBookings")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            View your pilgrimage booking history and download invoices.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading your booking details...</div>
        ) : bookings.length === 0 ? (
          <Card className="border border-dashed border-[#D4AF37]/45 bg-white p-12 text-center rounded-xl space-y-4">
            <Info className="h-12 w-12 text-[#EA580C] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-gray-800">No Bookings Found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              You haven't made any reservations yet. Search rooms and book your stay for the upcoming pilgrimage.
            </p>
            <Button 
              onClick={() => router.push("/rooms")}
              className="bg-[#EA580C] text-white hover:bg-[#C2410C] font-semibold px-6 shadow"
            >
              Book a Room
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden border border-[#D4AF37]/20 shadow-sm bg-white rounded-xl">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  {/* Status header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-150 pb-4">
                    <div>
                      <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Booking Number</span>
                      <h3 className="font-mono text-base font-bold text-gray-800">{booking.bookingNumber}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(booking.bookingStatus)}`}>
                        Booking: {booking.bookingStatus}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(booking.paymentStatus)}`}>
                        Payment: {booking.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Core details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                    <div className="space-y-1">
                      <span className="text-xs text-gray-400 font-medium">Room Reserved</span>
                      <p className="font-serif font-bold text-gray-800">{booking.room.roomType}</p>
                      <p className="text-xs text-gray-500 font-semibold">Room Number: {booking.room.roomNumber}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-gray-400 font-medium">Dates & Stay</span>
                      <p className="font-semibold text-gray-800 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-[#EA580C] shrink-0" /> {new Date(booking.checkIn).toLocaleDateString()} to {new Date(booking.checkOut).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500 font-medium">For {booking.adults} Adults, {booking.children} Children</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-gray-400 font-medium">Total Paid Amount</span>
                      <p className="text-xl font-bold text-[#EA580C]">₹{booking.amount}</p>
                      <p className="text-xs text-gray-500 font-medium capitalize">Mode: {booking.payments?.[0]?.paymentMethod || "CASH"}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-gray-150 pt-4 flex flex-wrap justify-end gap-3">
                    <Button
                      onClick={() => handlePrintReceipt(booking)}
                      variant="outline"
                      className="border-[#D4AF37] text-gray-700 hover:bg-[#FFF8E7] flex items-center gap-2 text-xs h-9"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                      Invoice / Receipt
                    </Button>
                    {(booking.bookingStatus === "CONFIRMED" || booking.bookingStatus === "PENDING") && (
                      <Button
                        onClick={() => handleCancelBooking(booking.id)}
                        variant="destructive"
                        className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 flex items-center gap-2 text-xs h-9"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

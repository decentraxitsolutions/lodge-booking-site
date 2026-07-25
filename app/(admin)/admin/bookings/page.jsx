"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Check, LogOut, XSquare, Printer, CreditCard } from "lucide-react";

export default function BookingsManagerPage() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fallbacks
  const mockBookings = [
    {
      id: "1",
      bookingNumber: "SVBN-839201",
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      adults: 2,
      children: 1,
      amount: 2000,
      bookingStatus: "CONFIRMED",
      paymentStatus: "PENDING",
      room: { roomNumber: "101", roomType: "Standard AC Room" },
      user: { name: "Vitthal Kulkarni", phone: "+91 98901 23456" }
    },
    {
      id: "2",
      bookingNumber: "SVBN-482012",
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      adults: 4,
      children: 2,
      amount: 3500,
      bookingStatus: "CHECKED_IN",
      paymentStatus: "PAID",
      room: { roomNumber: "301", roomType: "Family AC Room" },
      user: { name: "Radha Ghadge", phone: "+91 98502 98765" }
    }
  ];

  const fetchAllBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.length > 0 ? data : mockBookings);
      } else {
        setBookings(mockBookings);
      }
    } catch (e) {
      setBookings(mockBookings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, bookingStatus, paymentStatus = null) => {
    try {
      const updatePayload = { bookingStatus };
      if (paymentStatus) {
        updatePayload.paymentStatus = paymentStatus;
      }
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (res.ok) {
        alert("Booking updated successfully!");
        fetchAllBookings();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update booking status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status.");
    }
  };

  const handleUpdatePaymentStatus = async (bookingId, paymentStatus) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });

      if (res.ok) {
        alert("Payment status updated successfully!");
        fetchAllBookings();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update payment status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating payment status.");
    }
  };

  const handlePrintInvoice = (booking) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${booking.bookingNumber}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            .header { text-align: center; border-bottom: 2px solid #EA580C; padding-bottom: 20px; }
            .header h1 { color: #EA580C; margin: 0; }
            .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .table th { background-color: #f9f9f9; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <h1>श्री साई विठ्ठल भक्त निवास</h1>
            <p>LIC Road, Opposite Vitthal Rukmini Bhakt Niwas, Pandharpur</p>
          </div>
          <h2>Booking Invoice</h2>
          <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
          <p><strong>Customer Name:</strong> ${booking.user.name}</p>
          <p><strong>Phone:</strong> ${booking.user.phone || "N/A"}</p>
          <table class="table">
            <tr><th>Room Details</th><td>Room ${booking.room.roomNumber} (${booking.room.roomType})</td></tr>
            <tr><th>Check-in</th><td>${new Date(booking.checkIn).toLocaleDateString()}</td></tr>
            <tr><th>Check-out</th><td>${new Date(booking.checkOut).toLocaleDateString()}</td></tr>
            <tr><th>Guests</th><td>${booking.adults} Adults, ${booking.children} Children</td></tr>
            <tr><th>Total Amount</th><td><strong>₹${booking.amount}</strong></td></tr>
            <tr><th>Payment Status</th><td>${booking.paymentStatus}</td></tr>
            <tr><th>Booking Status</th><td>${booking.bookingStatus}</td></tr>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredBookings = bookings.filter(b => 
    b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
    b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.room?.roomNumber?.includes(search)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "CHECKED_IN": return "bg-blue-50 text-blue-600 border-blue-200";
      case "CHECKED_OUT": return "bg-gray-100 text-gray-600 border-gray-200";
      case "CANCELLED": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-amber-50 text-amber-600 border-amber-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Manage Bookings</h2>
          <p className="text-sm text-gray-500 mt-1">Check-in, Check-out, Cancel reservations, and generate invoices.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-150 shadow-sm max-w-md">
        <Search className="h-5 w-5 text-gray-400 shrink-0" />
        <Input
          placeholder="Search by Booking #, Name, Room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none bg-transparent focus-visible:ring-0 p-0 h-auto text-sm"
        />
      </div>

      {/* Table grid */}
      {loading ? (
        <div>Loading booking inventory...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-[#FFF8E7]/40 text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Booking #</th>
                  <th className="px-6 py-4">Guest Info</th>
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Stay Dates</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-[#EA580C]">{b.bookingNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-800">{b.user?.name || "Devotee"}</span>
                        <span className="text-xs text-gray-400">{b.user?.phone || "No Phone"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>Room {b.room?.roomNumber}</span>
                        <span className="text-xs text-gray-400">{b.room?.roomType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="flex flex-col">
                        <span>Check-in: {new Date(b.checkIn).toLocaleDateString()}</span>
                        <span>Check-out: {new Date(b.checkOut).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-800 font-bold">₹{b.amount}</span>
                        <span className="text-[10px] text-gray-400 capitalize">Payment: {b.paymentStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold ${getStatusColor(b.bookingStatus)}`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handlePrintInvoice(b)}
                          className="h-8 w-8 text-gray-500 hover:text-gray-800"
                          title="Print Invoice"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>

                        {/* Toggle payment confirmation action */}
                        {b.bookingStatus !== "CANCELLED" && (
                          <Button 
                            size="icon" 
                            onClick={() => handleUpdatePaymentStatus(b.id, b.paymentStatus === "PAID" ? "PENDING" : "PAID")}
                            className={`h-8 w-8 ${b.paymentStatus === "PAID" ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-600" : "bg-amber-50 hover:bg-amber-100 text-amber-600"}`}
                            title={b.paymentStatus === "PAID" ? "Mark Payment as PENDING" : "Mark Payment as PAID"}
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {/* Check-in action */}
                        {b.bookingStatus === "CONFIRMED" && (
                          <Button 
                            size="icon" 
                            onClick={() => handleUpdateStatus(b.id, "CHECKED_IN")}
                            className="h-8 w-8 bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                            title="Check-in Guest"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Check-out action */}
                        {b.bookingStatus === "CHECKED_IN" && (
                          <Button 
                            size="icon" 
                            onClick={() => handleUpdateStatus(b.id, "CHECKED_OUT", "PAID")}
                            className="h-8 w-8 bg-blue-50 hover:bg-blue-100 text-blue-600"
                            title="Check-out Guest & Mark Paid"
                          >
                            <LogOut className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Cancel action */}
                        {(b.bookingStatus === "CONFIRMED" || b.bookingStatus === "PENDING") && (
                          <Button 
                            size="icon" 
                            variant="destructive" 
                            onClick={() => handleUpdateStatus(b.id, "CANCELLED")}
                            className="h-8 w-8 bg-red-50 hover:bg-red-100 text-red-600 border-none"
                            title="Cancel Booking"
                          >
                            <XSquare className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

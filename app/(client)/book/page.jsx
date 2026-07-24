"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useTranslation } from "@/lib/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Users, ShieldCheck, CreditCard, CheckCircle } from "lucide-react";

function BookingCheckoutContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user: clerkUser } = useUser();

  const roomId = searchParams.get("roomId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const defaultGuests = searchParams.get("guests") ? parseInt(searchParams.get("guests")) : 2;

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nights, setNights] = useState(1);
  
  // Checkout details form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [adults, setAdults] = useState(defaultGuests);
  const [children, setChildren] = useState(0);
  const [specialRequest, setSpecialRequest] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH"); // CASH = Pay at property
  
  const [submitting, setSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  // Load details from Clerk user when ready
  useEffect(() => {
    if (clerkUser) {
      setName(clerkUser.fullName || "");
      setEmail(clerkUser.primaryEmailAddress?.emailAddress || "");
      setPhone(clerkUser.primaryPhoneNumber?.phoneNumber || "");
    }
  }, [clerkUser]);

  // Load room details and calculate nights
  useEffect(() => {
    if (!roomId) return;
    async function loadRoomDetails() {
      try {
        const res = await fetch(`/api/rooms/${roomId}`);
        if (res.ok) {
          const data = await res.json();
          setRoom(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    // Calculate nights
    if (checkIn && checkOut) {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays || 1);
    }
    
    loadRoomDetails();
  }, [roomId, checkIn, checkOut]);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const amount = room.price * nights;

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          checkIn,
          checkOut,
          adults,
          children,
          amount,
          specialRequest,
          paymentMethod
        }),
      });

      if (res.ok) {
        const booking = await res.json();
        setSuccessBooking(booking);
      } else {
        const err = await res.json();
        alert(err.error || "Something went wrong during checkout.");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-24 text-gray-500 font-semibold">Loading checkout details...</div>;
  }

  if (!room) {
    return <div className="text-center py-24 text-red-500 font-semibold">Room not found. Please go back and select a room.</div>;
  }

  const totalAmount = room.price * nights;

  // Success view
  if (successBooking) {
    return (
      <div className="bg-[#FFF8E7] min-h-screen py-24 text-[#374151] flex items-center justify-center">
        <Card className="max-w-md w-full border border-[#D4AF37]/35 bg-white shadow-xl rounded-xl p-8 text-center space-y-6">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
          
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-gray-800">
              {t("booking.confirmation")}
            </h2>
            <p className="text-sm text-gray-600">
              {t("booking.congrats")}
            </p>
          </div>

          <div className="bg-[#FFF8E7] p-4 rounded-lg border border-[#D4AF37]/20 text-left space-y-2 text-sm">
            <p><strong>{t("booking.bookingNo")}:</strong> <span className="font-mono font-bold text-[#EA580C]">{successBooking.bookingNumber}</span></p>
            <p><strong>Room:</strong> {room.roomType} (Room {room.roomNumber})</p>
            <p><strong>Check-in:</strong> {checkIn}</p>
            <p><strong>Check-out:</strong> {checkOut}</p>
            <p><strong>{t("booking.totalAmount")}:</strong> ₹{totalAmount}</p>
            <p><strong>Payment Mode:</strong> {paymentMethod === "CASH" ? t("booking.payAtProperty") : "Online Pre-paid (Mock)"}</p>
          </div>

          <p className="text-xs text-emerald-600 font-medium">
            {t("booking.whatsappSent")}
          </p>

          <Button 
            onClick={() => router.push("/my-bookings")}
            className="w-full bg-[#EA580C] text-white hover:bg-[#C2410C] font-semibold h-11 shadow"
          >
            Go to My Bookings
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8E7] min-h-screen py-24 text-[#374151]">
      <div className="mx-auto max-w-5xl px-6">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-3xl font-bold text-[#EA580C] sm:text-4xl">
            Confirm Your Stay
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Please fill in details to confirm your room at Shri Sai Vitthal Bhakt Niwas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-8 items-start">
          
          {/* Checkout Details Form */}
          <form onSubmit={handleCheckoutSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-[#D4AF37]/25 shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-gray-800 border-b border-[#D4AF37]/15 pb-2">
              {t("booking.fillDetails")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">{t("contact.name")}</label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-[#D4AF37]/30 h-10 bg-[#FFF8E7]/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">{t("contact.phone")}</label>
                <Input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-[#D4AF37]/30 h-10 bg-[#FFF8E7]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">{t("contact.email")}</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[#D4AF37]/30 h-10 bg-[#FFF8E7]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">{t("roomDetails.adults")}</label>
                <Input
                  type="number"
                  min={1}
                  max={room.capacity}
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value))}
                  className="border-[#D4AF37]/30 h-10 text-center font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">{t("roomDetails.children")}</label>
                <Input
                  type="number"
                  min={0}
                  max={4}
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value))}
                  className="border-[#D4AF37]/30 h-10 text-center font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">{t("roomDetails.specialRequest")}</label>
              <Textarea
                placeholder="e.g. Early check-in request, ground floor request for elders..."
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                className="border-[#D4AF37]/30 min-h-24 bg-[#FFF8E7]/20"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">{t("booking.payment")}</label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod("CASH")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === "CASH" 
                    ? "border-[#EA580C] bg-[#FFF8E7]/40 text-[#EA580C]" 
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === "CASH"} 
                      onChange={() => setPaymentMethod("CASH")}
                    />
                    <span className="font-bold text-sm">{t("booking.payAtProperty")}</span>
                  </div>
                </div>
                <div 
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === "ONLINE" 
                    ? "border-[#EA580C] bg-[#FFF8E7]/40 text-[#EA580C]" 
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === "ONLINE"} 
                      onChange={() => setPaymentMethod("ONLINE")}
                    />
                    <span className="font-bold text-sm">{t("booking.payOnline")} (Mock)</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-[#EA580C] text-white hover:bg-[#C2410C] h-12 text-base font-bold shadow-md rounded-lg"
            >
              {submitting ? "Processing booking..." : t("roomDetails.submitBooking")}
            </Button>
          </form>

          {/* Pricing & Booking Details Summary Panel */}
          <div className="space-y-6">
            <Card className="border border-[#D4AF37]/35 bg-white shadow-md rounded-xl">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-serif text-lg font-bold text-gray-800 border-b border-gray-150 pb-2">
                  Booking Summary
                </h3>

                <div className="aspect-video w-full overflow-hidden bg-gray-100 rounded-lg border border-gray-200">
                  <img
                    src={room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600"}
                    alt={room.roomType}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-[#EA580C]">{room.roomType}</h4>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Room Number: {room.roomNumber}</p>
                </div>

                <div className="border-t border-b border-gray-150 py-4 space-y-3 text-sm">
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-[#EA580C]" /> Check-in</span>
                    <span className="font-semibold text-gray-800">{checkIn}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-[#EA580C]" /> Check-out</span>
                    <span className="font-semibold text-gray-800">{checkOut}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Nights</span>
                    <span className="font-semibold text-gray-800">{nights} {nights > 1 ? "Nights" : "Night"}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#EA580C]" /> Capacity Selected</span>
                    <span className="font-semibold text-gray-800">{adults} Adults, {children} Children</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Room Rate (per night)</span>
                    <span>₹{room.price}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-gray-800 text-lg border-t border-gray-150 pt-3">
                    <span>{t("booking.totalAmount")}</span>
                    <span className="text-[#EA580C]">₹{totalAmount}</span>
                  </div>
                </div>

              </CardContent>
            </Card>

            <div className="bg-[#FFF8E7] border border-[#D4AF37]/25 p-4 rounded-xl flex gap-3 text-xs text-gray-600 items-start">
              <ShieldCheck className="h-6 w-6 text-[#EA580C] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Spiritual Atmosphere Policy:</strong> Smoking, consumption of alcohol, or non-vegetarian food is strictly forbidden inside the property premises.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function BookingCheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 text-gray-500">Loading checkout resource...</div>}>
      <BookingCheckoutContent />
    </Suspense>
  );
}

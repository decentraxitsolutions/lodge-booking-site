import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params; // Await params for Next.js 16 compatibility
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User record not found" }, { status: 400 });
    }

    const { bookingStatus, paymentStatus } = await req.json();

    // Check if booking exists
    const booking = await db.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Role verification: Standard users can only cancel their own bookings
    const isOwner = booking.userId === user.id;
    const isStaff = user.role === "ADMIN" || user.role === "RECEPTION_STAFF";

    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // If cancellation is requested
    const updatedData = {};
    if (bookingStatus) {
      if (bookingStatus === "CANCELLED" && !isStaff && booking.bookingStatus !== "PENDING" && booking.bookingStatus !== "CONFIRMED") {
        return NextResponse.json({ error: "Booking cannot be cancelled in its current state." }, { status: 400 });
      }
      updatedData.bookingStatus = bookingStatus;
    }

    if (paymentStatus && isStaff) {
      updatedData.paymentStatus = paymentStatus;
    }

    const updatedBooking = await db.booking.update({
      where: { id },
      data: updatedData,
      include: { room: true },
    });

    return NextResponse.json(updatedBooking);
  } catch (err) {
    console.error("Error updating booking status: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

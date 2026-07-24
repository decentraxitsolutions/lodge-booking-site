import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function GET(req) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    // Admins can see all bookings, customers only see their own
    let bookings = [];
    if (user.role === "ADMIN" || user.role === "RECEPTION_STAFF") {
      bookings = await db.booking.findMany({
        include: { room: true, user: true },
        orderBy: { createdAt: "desc" },
      });
    } else {
      bookings = await db.booking.findMany({
        where: { userId: user.id },
        include: { room: true },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find database user corresponding to clerk authentication
    const user = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User record not found." }, { status: 400 });
    }

    const { roomId, checkIn, checkOut, adults, children, amount, specialRequest, paymentMethod } = await req.json();

    if (!roomId || !checkIn || !checkOut || !adults || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Required fields are missing (roomId, checkIn, checkOut, adults, amount, paymentMethod)" },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Double-booking check: verify if the room is still available for selected dates
    const conflictingBooking = await db.booking.findFirst({
      where: {
        roomId,
        bookingStatus: { not: "CANCELLED" },
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { error: "The room is already booked for the selected dates. Please choose another room or search again." },
        { status: 409 }
      );
    }

    // Create unique booking number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingNumber = `SVBN-${Date.now().toString().slice(-6)}${randomSuffix}`;

    // Create transaction in Prisma for booking & corresponding payment record
    const result = await db.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          bookingNumber,
          userId: user.id,
          roomId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          adults: parseInt(adults),
          children: parseInt(children || 0),
          amount: parseFloat(amount),
          specialRequest: specialRequest || "",
          bookingStatus: "CONFIRMED", // Default checkout is confirmed directly for pay-at-property/test checkouts
          paymentStatus: paymentMethod === "CASH" ? "PENDING" : "PAID",
        },
      });

      const payment = await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: parseFloat(amount),
          paymentMethod,
          status: paymentMethod === "CASH" ? "PENDING" : "PAID",
          transactionId: paymentMethod === "CASH" ? "" : `TXN-${Date.now()}`,
        },
      });

      return { booking, payment };
    });

    return NextResponse.json(result.booking, { status: 201 });
  } catch (err) {
    console.error("Error creating booking: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

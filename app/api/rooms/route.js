import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const guests = searchParams.get("guests") ? parseInt(searchParams.get("guests")) : null;
    const roomType = searchParams.get("roomType");

    let excludedRoomIds = [];

    // Check for availability overlapping bookings
    if (checkIn && checkOut) {
      const bookingsOverlapping = await db.booking.findMany({
        where: {
          bookingStatus: { not: "CANCELLED" },
          AND: [
            { checkIn: { lt: new Date(checkOut) } },
            { checkOut: { gt: new Date(checkIn) } },
          ],
        },
        select: { roomId: true },
      });
      excludedRoomIds = bookingsOverlapping.map((b) => b.roomId);
    }

    // Filter build
    const whereClause = {
      status: "AVAILABLE",
    };

    if (excludedRoomIds.length > 0) {
      whereClause.id = { notIn: excludedRoomIds };
    }

    if (guests) {
      whereClause.capacity = { gte: guests };
    }

    if (roomType && roomType !== "ALL") {
      whereClause.roomType = roomType;
    }

    const rooms = await db.room.findMany({
      where: whereClause,
      orderBy: { price: "asc" },
    });

    return NextResponse.json(rooms);
  } catch (err) {
    console.error("Error fetching rooms: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { roomNumber, roomType, description, capacity, price, amenities, images } = await req.json();

    if (!roomNumber || !roomType || !description || !capacity || !price) {
      return NextResponse.json(
        { error: "Required fields are missing (roomNumber, roomType, description, capacity, price)" },
        { status: 400 }
      );
    }

    const newRoom = await db.room.create({
      data: {
        roomNumber,
        roomType,
        description,
        capacity: parseInt(capacity),
        price: parseFloat(price),
        amenities: amenities || [],
        images: images || [],
      },
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (err) {
    console.error("Error creating room: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

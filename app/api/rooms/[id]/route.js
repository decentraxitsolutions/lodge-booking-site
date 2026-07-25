import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const room = await db.room.findUnique({
      where: { id },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room);
  } catch (err) {
    console.error("Error fetching room details: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const { roomNumber, roomType, description, capacity, price, amenities, images, status } = await req.json();

    const updatedRoom = await db.room.update({
      where: { id },
      data: {
        roomNumber,
        roomType,
        description,
        capacity: parseInt(capacity),
        price: parseFloat(price),
        amenities: amenities || [],
        images: images || [],
        status: status || "AVAILABLE",
      },
    });

    return NextResponse.json(updatedRoom);
  } catch (err) {
    console.error("Error updating room details: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await db.room.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error("Error deleting room: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

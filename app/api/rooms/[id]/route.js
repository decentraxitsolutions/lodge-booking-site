import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { id } = await params; // Await params for Next.js 16 compatibility
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

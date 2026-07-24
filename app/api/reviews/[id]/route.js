import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params; // Await params for Next.js 16 compatibility
    const { approved } = await req.json();

    const updatedReview = await db.review.update({
      where: { id },
      data: { approved: approved ?? false },
    });

    return NextResponse.json(updatedReview);
  } catch (err) {
    console.error("Error updating review: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params; // Await params for Next.js 16 compatibility

    await db.review.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

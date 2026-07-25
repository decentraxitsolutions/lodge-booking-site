import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const { id } = await params; // Await params for Next.js 16 compatibility
    const { image, title, category } = await req.json();

    const updatedItem = await db.gallery.update({
      where: { id },
      data: {
        image,
        title: title || "",
        category,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (err) {
    console.error("Error updating gallery item: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params; // Await params for Next.js 16 compatibility

    await db.gallery.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Gallery item deleted successfully" });
  } catch (err) {
    console.error("Error deleting gallery item: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

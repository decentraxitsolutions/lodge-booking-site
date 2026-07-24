import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const galleryItems = await db.gallery.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(galleryItems);
  } catch (err) {
    console.error("Error fetching gallery: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { image, title, category } = await req.json();

    if (!image || !category) {
      return NextResponse.json({ error: "Image URL and Category are required." }, { status: 400 });
    }

    const newItem = await db.gallery.create({
      data: {
        image,
        title: title || "",
        category,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    console.error("Error creating gallery item: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { name, phone, email, message } = await req.json();

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Name, phone, and message are required." },
        { status: 400 }
      );
    }

    const newMessage = await db.contactMessage.create({
      data: {
        name,
        phone,
        email: email || "",
        message,
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (err) {
    console.error("Error creating contact message: ", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

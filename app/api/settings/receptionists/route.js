import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req) {
  try {
    const receptionists = await db.user.findMany({
      where: { role: "RECEPTION_STAFF" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(receptionists);
  } catch (err) {
    console.error("Error fetching receptionists:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      if (existingUser.role === "ADMIN") {
        return NextResponse.json({ error: "User is an Admin. Admin role cannot be demoted to Receptionist here." }, { status: 400 });
      }
      
      // Update existing user role
      const updatedUser = await db.user.update({
        where: { id: existingUser.id },
        data: { role: "RECEPTION_STAFF" },
      });
      return NextResponse.json(updatedUser);
    }

    // Create a new invited receptionist with a placeholder clerkId
    const placeholderClerkId = `invited-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const invitedUser = await db.user.create({
      data: {
        clerkId: placeholderClerkId,
        email: trimmedEmail,
        name: "Invited Staff",
        role: "RECEPTION_STAFF",
      },
    });

    return NextResponse.json(invitedUser);
  } catch (err) {
    console.error("Error creating receptionist invite:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Downgrade to GUEST/CUSTOMER
    const updated = await db.user.update({
      where: { id },
      data: { role: "CUSTOMER" },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error removing receptionist role:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

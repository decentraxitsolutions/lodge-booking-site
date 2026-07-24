import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const approved = searchParams.get("approved");

    const whereClause = {};
    if (approved) {
      whereClause.approved = approved === "true";
    }

    const reviews = await db.review.findMany({
      where: whereClause,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId, rating, review } = await req.json();

    if (!userId || !rating || !review) {
      return NextResponse.json({ error: "userId, rating, and review content are required." }, { status: 400 });
    }

    const newReview = await db.review.create({
      data: {
        userId,
        rating: parseInt(rating),
        review,
        approved: false, // Default is unapproved (awaits moderation)
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (err) {
    console.error("Error creating review: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

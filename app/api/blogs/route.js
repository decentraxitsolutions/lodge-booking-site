import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const blogs = await db.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(blogs);
  } catch (err) {
    console.error("Error fetching blogs: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, slug, content, image, published } = await req.json();

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required." }, { status: 400 });
    }

    const newBlog = await db.blog.create({
      data: {
        title,
        slug,
        content,
        image: image || "",
        published: published ?? false,
      },
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (err) {
    console.error("Error creating blog post: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

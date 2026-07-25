import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const { id } = await params; // Await params for Next.js 16 compatibility
    const { title, slug, content, image, published } = await req.json();

    const updatedBlog = await db.blog.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        image: image || "",
        published: published ?? false,
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (err) {
    console.error("Error updating blog post: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params; // Await params for Next.js 16 compatibility

    await db.blog.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog post: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { client } from "@/lib/sanity.client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { title, slug, authorId, body } = await request.json();

  const newPost = {
    _type: "post",
    title,
    slug: {
      _type: "slug",
      current: slug,
    },
    author: {
      _type: "reference",
      _ref: authorId,
    },
    body,
    publishedAt: new Date().toISOString(),
  };

  try {
    const result = await client.create(newPost);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
} 
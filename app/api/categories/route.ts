import { client } from "@/lib/sanity.client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `*[_type == "category"] {
      _id,
      title,
      slug,
      "postCount": count(*[_type == "post" && references(^._id)])
    }`;
    
    const categories = await client.fetch(query);
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 }
    );
  }
} 
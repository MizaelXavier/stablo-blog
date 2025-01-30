import { client } from "@/lib/sanity.client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `*[_type == "author"] {
      _id,
      name,
      slug,
      image,
      "postCount": count(*[_type == "post" && references(^._id)])
    }`;
    
    const authors = await client.fetch(query);
    return NextResponse.json({ authors });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar autores" },
      { status: 500 }
    );
  }
} 
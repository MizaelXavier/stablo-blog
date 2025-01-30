import { client } from "@/lib/sanity.client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const query = `*[_type == "post" && author->slug.current == $slug] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      "author": author->{name, slug},
      "categories": categories[]->{title, slug}
    }`;
    
    const posts = await client.fetch(query, { slug: params.slug });
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar posts do autor" },
      { status: 500 }
    );
  }
} 
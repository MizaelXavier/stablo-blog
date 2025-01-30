import { client } from "@/lib/sanity.client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      excerpt,
      body,
      publishedAt,
      "author": author->{
        name,
        slug,
        image
      },
      "categories": categories[]->{
        _id,
        title,
        slug,
        color
      }
    }`;
    
    const posts = await client.fetch(query);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return NextResponse.json(
      { error: "Erro ao buscar posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPost = {
      _type: "post",
      title: body.title,
      slug: {
        _type: "slug",
        current: body.slug,
      },
      author: {
        _type: "reference",
        _ref: body.authorId,
      },
      publishedAt: new Date().toISOString(),
      body: body.body
    };

    console.log('Tentando criar post:', JSON.stringify(newPost, null, 2));
    
    const post = await client.create(newPost);
    console.log('Post criado:', post);
    
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Erro ao criar post",
        details: error
      },
      { status: 500 }
    );
  }
} 
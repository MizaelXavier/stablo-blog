import { client } from "@/lib/sanity.client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const query = `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      body[] {
        ...,
        _type == "youtube" => {
          ...,
          url,
          title,
          description,
          thumbnail
        }
      },
      youtubeVideo,
      publishedAt,
      mainImage,
      "author": author->{
        _id,
        name,
        slug,
        image,
        bio,
        "postCount": count(*[_type == "post" && references(^._id)])
      },
      "categories": categories[]->{
        _id,
        title,
        slug
      }
    }`;
    
    const post = await client.fetch(query, { slug: params.slug });
    
    if (!post) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    return NextResponse.json(
      { error: "Erro ao buscar post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    // Primeiro busca o ID do post pelo slug
    const query = `*[_type == "post" && slug.current == $slug][0]._id`;
    const postId = await client.fetch(query, { slug: params.slug });
    
    if (!postId) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 }
      );
    }

    const post = await client
      .patch(postId)
      .set(body)
      .commit();
    
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Primeiro busca o ID do post pelo slug
    const query = `*[_type == "post" && slug.current == $slug][0]._id`;
    const postId = await client.fetch(query, { slug: params.slug });
    
    if (!postId) {
      return NextResponse.json(
        { error: "Post não encontrado" },
        { status: 404 }
      );
    }

    await client.delete(postId);
    return NextResponse.json({ message: "Post deletado com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar post" },
      { status: 500 }
    );
  }
} 
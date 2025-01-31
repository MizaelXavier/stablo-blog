import { client } from "@/lib/sanity.client";
import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { markdownToBlocks } from "@/lib/utils/markdownToBlocks";
import { v4 as uuidv4 } from 'uuid';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-02-27",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN
});

export async function GET() {
  try {
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      "author": author->name,
      publishedAt,
      "categories": categories[]->title
    }`;
    
    const posts = await client.fetch(query);
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Converter o markdown para blocos do Sanity se o corpo do post for uma string
    const postContent = typeof body.body === 'string' 
      ? markdownToBlocks(body.body, {
          mainImage: body.mainImage,
          youtubeUrl: body.youtubeUrl
        }) 
      : { body: body.body, mainImage: body.mainImage };
    
    // Adicionar chaves únicas aos blocos
    const blocksWithKeys = postContent.body.map(block => ({
      ...block,
      _key: uuidv4()
    }));

    const newPost = {
      _type: "post",
      title: body.title,
      slug: {
        _type: "slug",
        current: body.slug,
      },
      excerpt: body.excerpt,
      author: {
        _type: "reference",
        _ref: body.authorId,
      },
      publishedAt: new Date().toISOString(),
      body: blocksWithKeys,
      ...(postContent.mainImage && { mainImage: postContent.mainImage })
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

export async function DELETE(request: Request) {
  try {
    // Primeiro busca todos os IDs dos posts
    const query = `*[_type == "post"]._id`;
    const postIds = await writeClient.fetch(query);
    
    // Deleta cada post
    const deletePromises = postIds.map(id => writeClient.delete(id));
    await Promise.all(deletePromises);
    
    return NextResponse.json({ 
      success: true, 
      message: `${postIds.length} posts foram deletados com sucesso` 
    });
  } catch (error) {
    console.error('Erro ao deletar posts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Erro ao deletar posts",
        details: error
      },
      { status: 500 }
    );
  }
} 
import { client } from "@/lib/sanity.client";
import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { markdownToBlocks } from "@/lib/utils/markdownToBlocks";
import { v4 as uuidv4 } from 'uuid';

// Adicionamos esta linha para desabilitar o cache na rota
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Adicionando custom fetch local para o client de escrita
const customFetch: typeof fetch = (resource: RequestInfo, init?: RequestInit) => {
  return fetch(resource, {
    ...init,
    cache: 'no-store',
    next: { revalidate: 0 }
  });
};

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-02-27",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  fetch: customFetch as any, // adiciona custom fetch para o writeClient (type cast para any)
});

// Interfaces para tipagem
interface SanityBlock {
  _type: string;
  _key: string;
  [key: string]: any;
}

interface PostContent {
  blocks: SanityBlock[];
  mainImage?: {
    _type: string;
    asset: {
      _type: string;
      _ref: string;
    };
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = parseInt(searchParams.get('start') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Consulta otimizada sem campos pesados
    const query = `{
      "posts": *[_type == "post"] | order(publishedAt desc) [$start...$end] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        excerpt,
        featured,
        "mainImage": mainImage.asset-> {
          "url": url,
          "lqip": metadata.lqip
        },
        "author": author->{ name },
        "categories": categories[]->{ title }
      },
      "total": count(*[_type == "post"])
    }`;

    const result = await client.fetch(query, {
      start,
      end: start + limit - 1
    });

    // Remove campos nulos/undefined para reduzir tamanho
    const cleanPosts = result.posts.map(post => {
      const cleanPost = {};
      Object.entries(post).forEach(([key, value]) => {
        if (value != null) {
          cleanPost[key] = value;
        }
      });
      return cleanPost;
    });

    return new Response(
      JSON.stringify({
        posts: cleanPosts,
        pagination: {
          total: result.total,
          start,
          limit,
          hasMore: start + limit < result.total
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
        }
      }
    );
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return new Response(
      JSON.stringify({
        error: "Erro ao buscar posts",
        details: error instanceof Error ? error.message : error
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Processar o conteúdo do post
    let postContent: PostContent;
    
    if (typeof body.body === 'string') {
      const blocks = markdownToBlocks(body.body, {
        mainImage: body.mainImage,
        youtubeUrl: body.youtubeUrl
      });
      
      postContent = {
        blocks: blocks.map(block => ({
          ...block,
          _key: uuidv4()
        })),
        mainImage: body.mainImage ? {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: body.mainImage
          }
        } : undefined
      };
    } else {
      postContent = {
        blocks: body.body.map((block: any) => ({
          ...block,
          _key: uuidv4()
        })),
        mainImage: body.mainImage ? {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: body.mainImage
          }
        } : undefined
      };
    }

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
      body: postContent.blocks,
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
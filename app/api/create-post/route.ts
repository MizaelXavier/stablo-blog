import { client } from "@/lib/sanity.client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { markdownToBlocks } from "@/lib/utils/markdownToBlocks";
import { uploadImageFromUrl } from "@/lib/utils/uploadImage";

// Schema de validação para o payload
const PostSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  authorId: z.string().min(1, "ID do autor é obrigatório"),
  body: z.union([z.string(), z.array(z.any())]),
  excerpt: z.string().optional(),
  mainImageUrl: z.string().url().optional(),
  youtubeUrl: z.string().optional(),
  categories: z.array(z.string()).optional(),
  featured: z.boolean().optional()
});

interface PostContent {
  blocks: any[];
  mainImage?: {
    _type: "image";
    asset: {
      _type: "reference";
      _ref: string;
    };
  };
}

export async function POST(request: Request) {
  try {
    // Validar CORS
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Verificar token de autenticação
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Token de autenticação não fornecido" },
        { status: 401 }
      );
    }

    // Validar payload
    const body = await request.json();
    const validatedData = PostSchema.parse(body);

    console.log('📄 Dados recebidos:', validatedData);

    let mainImageRef: string | undefined;
    if (validatedData.mainImageUrl) {
      try {
        console.log('🖼️ Processando imagem principal...');
        mainImageRef = await uploadImageFromUrl(validatedData.mainImageUrl);
        console.log('✅ Imagem processada com sucesso:', mainImageRef);
      } catch (error) {
        console.error('❌ Erro ao processar imagem:', error);
        throw new Error('Falha ao processar imagem');
      }
    }

    // Processar o conteúdo do post
    let postContent: PostContent;
    
    if (typeof validatedData.body === 'string') {
      const blocks = markdownToBlocks(validatedData.body, {
        mainImage: mainImageRef,
        youtubeUrl: validatedData.youtubeUrl
      });
      
      postContent = {
        blocks: blocks.map(block => ({
          ...block,
          _key: uuidv4()
        })),
        mainImage: mainImageRef ? {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: mainImageRef
          }
        } : undefined
      };
    } else {
      postContent = {
        blocks: validatedData.body.map((block: any) => ({
          ...block,
          _key: uuidv4()
        })),
        mainImage: mainImageRef ? {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: mainImageRef
          }
        } : undefined
      };
    }

    // Modificar a construção do mainImage
    const mainImage = mainImageRef ? {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: mainImageRef
      }
    } : undefined;

    const newPost = {
      _type: "post",
      title: validatedData.title,
      slug: {
        _type: "slug",
        current: validatedData.slug,
      },
      excerpt: validatedData.excerpt,
      author: {
        _type: "reference",
        _ref: validatedData.authorId,
      },
      publishedAt: new Date().toISOString(),
      body: postContent.blocks,
      mainImage: mainImage,
    };

    console.log('📝 Criando novo post...');
    const createdPost = await client.create(newPost);
    console.log('🎉 Post criado com sucesso:', createdPost._id);
    
    return NextResponse.json({ success: true, postId: createdPost._id });
  } catch (error) {
    console.error('💥 Erro catastrófico:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
} 
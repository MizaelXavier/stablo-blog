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
  body: z.string().min(1, "Conteúdo é obrigatório"),
  excerpt: z.string().optional(),
  mainImageUrl: z.string().url().optional(),
  youtubeUrl: z.string().optional()
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

interface Block {
  _type: string;
  _key: string;
  url?: string;
  style?: string;
  markDefs?: any[];
  children?: Array<{
    _type: string;
    _key: string;
    text: string;
  }>;
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
    
    // Criar os blocos formatados
    const blocks: Block[] = [];
    
    // Se houver URL do YouTube, adiciona como primeiro bloco
    if (validatedData.youtubeUrl) {
      blocks.push({
        _type: "youtube",
        _key: uuidv4(),
        url: validatedData.youtubeUrl
      });
    }
    
    // Adiciona o bloco de texto
    blocks.push({
      _type: "block",
      _key: uuidv4(),
      style: "normal",
      markDefs: [],
      children: [{
        _type: "span",
        _key: uuidv4(),
        text: validatedData.body
      }]
    });
    
    postContent = {
      blocks,
      mainImage: mainImageRef ? {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: mainImageRef
        }
      } : undefined
    };

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
      mainImage: postContent.mainImage
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
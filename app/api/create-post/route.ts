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
  mainImage: z.string().optional(),
  mainImageUrl: z.string().url().optional(),
  youtubeUrl: z.string().optional(),
  categories: z.array(z.string()).optional(),
  featured: z.boolean().optional()
});

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
    const payload = await request.json();
    const validatedData = PostSchema.parse(payload);

    // Fazer upload da imagem se fornecida via URL
    let mainImageId = validatedData.mainImage;
    if (validatedData.mainImageUrl) {
      try {
        mainImageId = await uploadImageFromUrl(validatedData.mainImageUrl);
      } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        // Continuar sem a imagem se houver erro no upload
      }
    }

    // Converter o corpo do post se for uma string
    const blocks = typeof validatedData.body === 'string' 
      ? markdownToBlocks(validatedData.body, {
          mainImage: mainImageId,
          youtubeUrl: validatedData.youtubeUrl
        })
      : validatedData.body;

    // Preparar documento para o Sanity
    const newPost = {
      _type: "post",
      title: validatedData.title,
      slug: {
        _type: "slug",
        current: validatedData.slug,
      },
      author: {
        _type: "reference",
        _ref: validatedData.authorId,
      },
      body: blocks,
      excerpt: validatedData.excerpt,
      featured: validatedData.featured ?? false,
      mainImage: mainImageId ? {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: mainImageId
        }
      } : undefined,
      categories: validatedData.categories?.map(catId => ({
        _type: "reference",
        _ref: catId
      })),
      publishedAt: new Date().toISOString(),
    };

    // Criar post no Sanity
    const result = await client.create(newPost);

    return NextResponse.json({
      success: true,
      data: {
        id: result._id,
        slug: result.slug.current,
        title: result.title,
        publishedAt: result.publishedAt
      }
    });

  } catch (error) {
    console.error("Erro ao criar post:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Dados inválidos", 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Erro interno do servidor",
        details: error
      },
      { status: 500 }
    );
  }
} 
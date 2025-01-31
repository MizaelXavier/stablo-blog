import { client } from "@/lib/sanity.client";
import { NextResponse } from "next/server";
import { PortableTextBlock } from "@portabletext/types";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

// Schema de validação para o payload
const PostSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  authorId: z.string().min(1, "ID do autor é obrigatório"),
  body: z.array(z.any()).min(1, "Conteúdo é obrigatório"),
  excerpt: z.string().optional(),
  mainImage: z.string().optional(),
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

    // Adicionar chaves únicas aos blocos do corpo
    const blocksWithKeys = validatedData.body.map(block => ({
      ...block,
      _key: uuidv4()
    }));

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
      body: blocksWithKeys,
      excerpt: validatedData.excerpt,
      featured: validatedData.featured ?? false,
      mainImage: validatedData.mainImage ? {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: validatedData.mainImage
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
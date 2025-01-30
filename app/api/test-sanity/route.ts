import { client } from "@/lib/sanity.client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Vamos fazer uma query mais específica e ver a estrutura dos documentos
    const query = `{
      "posts": *[_type == "post"] {
        _id,
        _type,
        title,
        slug
      },
      "types": *[_type in ["post", "author", "settings"]]._type
    }`;
    
    const data = await client.fetch(query);
    
    return NextResponse.json({ 
      success: true, 
      data,
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET
    });
  } catch (error) {
    console.error("Erro ao buscar dados do Sanity:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Erro desconhecido",
        details: error
      },
      { status: 500 }
    );
  }
} 
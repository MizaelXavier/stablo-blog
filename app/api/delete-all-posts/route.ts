import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-02-27",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  ignoreBrowserTokenWarning: true
});

export async function POST(request: Request) {
  // Verifica o token de autenticação
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.SANITY_API_WRITE_TOKEN;

  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== expectedToken) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    // Primeiro busca todos os IDs dos posts
    const query = `*[_type == "post"]._id`;
    const postIds = await writeClient.fetch(query);
    
    // Deleta cada post
    const deletePromises = postIds.map(id => writeClient.delete(id));
    await Promise.all(deletePromises);
    
    return NextResponse.json({ 
      success: true, 
      message: `${postIds.length} posts foram deletados com sucesso`,
      deletedIds: postIds
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
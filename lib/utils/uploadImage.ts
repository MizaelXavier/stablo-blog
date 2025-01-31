import { createClient } from '@sanity/client';

// Criar um cliente específico para upload com token
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-02-27',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

export async function uploadImageFromUrl(imageUrl: string) {
  try {
    // Validar URL
    if (!imageUrl.startsWith('http')) {
      throw new Error('URL inválida');
    }

    console.log('🔍 Verificando acessibilidade da imagem:', imageUrl);
    
    // Testar acessibilidade com timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 segundos

    const response = await fetch(imageUrl, { 
      signal: controller.signal 
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    console.log('✅ Imagem acessível. Iniciando download...');
    
    const buffer = Buffer.from(await response.arrayBuffer());
    console.log('📦 Tamanho do arquivo:', buffer.length, 'bytes');

    console.log('🚀 Iniciando upload para o Sanity...');
    const asset = await writeClient.assets.upload('image', buffer, {
      filename: imageUrl.split('/').pop() || 'imagem.jpg',
      contentType: response.headers.get('content-type') || 'image/jpeg'
    });

    console.log('🎉 Upload concluído. Asset ID:', asset._id);
    return asset._id;

  } catch (error) {
    console.error('🔥 Erro no upload:', error);
    throw new Error(`Falha no upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
} 
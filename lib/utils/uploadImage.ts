import { client } from "@/lib/sanity.client";

export async function uploadImageFromUrl(imageUrl: string) {
  try {
    // Fazer o fetch da imagem
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    // Criar um objeto File
    const file = new File([buffer], 'image.jpg', { type: 'image/jpeg' });

    // Fazer upload para o Sanity
    const asset = await client.assets.upload('image', file);

    return asset._id;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error;
  }
} 
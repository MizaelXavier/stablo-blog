import { PortableTextBlock } from "@portabletext/types";

export interface Post {
  _id: string;
  _type: 'post';
  title: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  excerpt?: string;
  mainImage?: {
    _type: 'image';
    asset: {
      _type: 'reference';
      _ref: string;
    };
  };
  body: PortableTextBlock[];
  author: {
    _type: 'reference';
    _ref: string;
    name?: string;
  };
  publishedAt: string;
  categories?: Array<{
    _type: 'reference';
    _ref: string;
  }>;
  featured?: boolean;
}

// Cache para otimizar a verificação de vídeos
const videoCache = new WeakMap<Post, boolean>();

/**
 * Verifica se um post contém vídeo do YouTube
 * @param post - O objeto do post a ser verificado
 * @returns boolean indicando se o post contém vídeo
 */
export const hasVideo = (post: Post): boolean => {
  if (!post?.body) return false;

  // Verifica se já temos o resultado em cache
  if (videoCache.has(post)) {
    return videoCache.get(post)!;
  }
  
  // Procura por blocos do tipo 'youtube' no corpo do post
  const result = post.body.some(block => 
    block._type === 'youtube' && 'url' in block && block.url
  );

  // Armazena o resultado em cache
  videoCache.set(post, result);
  
  return result;
};

export function validatePost(post: Partial<Post>): string[] {
  const errors: string[] = [];

  if (!post.title) errors.push('Título é obrigatório');
  if (!post.slug?.current) errors.push('Slug é obrigatório');
  if (!post.body?.length) errors.push('Conteúdo é obrigatório');
  if (!post.author?._ref) errors.push('Autor é obrigatório');

  return errors;
} 
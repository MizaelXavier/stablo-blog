import { getAuthorBySlug, getPostsByAuthor } from "@/lib/sanity/client";
import AuthorPage from "./author-page";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await getAuthorBySlug(params.slug);
  
  if (!author) {
    return {
      title: "Autor não encontrado"
    };
  }

  return {
    title: `${author.name} | Closer Brasil`,
    description: author.bio || `Artigos escritos por ${author.name}`,
    openGraph: {
      title: `${author.name} | Closer Brasil`,
      description: author.bio || `Artigos escritos por ${author.name}`,
      type: "profile",
      images: author.image ? [{ url: author.image }] : []
    }
  };
}

export default async function AuthorSlugRoute({ params }: Props) {
  const author = await getAuthorBySlug(params.slug);
  const posts = await getPostsByAuthor(params.slug);

  if (!author) {
    notFound();
  }

  return <AuthorPage author={author} posts={posts} />;
} 
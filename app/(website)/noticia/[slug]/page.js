import { getPostBySlug, getAllPostsSlugs } from "@/lib/sanity/client";
import { notFound } from "next/navigation";
import NoticiaPageTemplate from "./default";

export async function generateStaticParams() {
  const slugs = await getAllPostsSlugs();
  return slugs.map(slug => ({ slug: slug.slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Notícia não encontrada'
    };
  }
  return { 
    title: post.title,
    description: post.excerpt
  };
}

export default async function NoticiaPage({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <NoticiaPageTemplate post={post} />;
}

export const revalidate = 60;
